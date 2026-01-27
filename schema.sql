
-- Enable Extensions
create extension if not exists "uuid-ossp";

-- 1. Products Table
create table if not exists products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  price decimal not null,
  category text,
  brand text,
  is_featured boolean default false,
  is_new boolean default true,
  stock_quantity int default 0,
  metadata jsonb,
  images text[],
  created_at timestamptz default now()
);

-- 2. Orders with Precision Pins
create table if not exists orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id),
  total_amount decimal not null,
  status text default 'pending', 
  mpesa_checkout_id text,
  delivery_address jsonb,
  delivery_lat decimal(10, 8),
  delivery_lng decimal(11, 8),
  site_surface_type text, -- 'Stone', 'Gypsum', 'Wood'
  floor_number int,
  is_nairobi_delivery boolean default false,
  created_at timestamptz default now()
);

-- 3. Driver Missions (The Logistics Handshake)
create table if not exists driver_missions (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references orders(id) on delete cascade,
  driver_id uuid, -- Reference to profiles/auth
  mission_status text default 'assigned', -- assigned, in_transit, on_site, completed
  accepted_at timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  check (mission_status in ('assigned', 'in_transit', 'on_site', 'completed'))
);

-- 4. Live Telemetry (High-Frequency Stream)
create table if not exists live_delivery_pings (
  id bigint generated always as identity primary key,
  mission_id uuid references driver_missions(id) on delete cascade,
  order_id uuid references orders(id) on delete cascade,
  latitude decimal(10, 8) not null,
  longitude decimal(11, 8) not null,
  heading decimal(5, 2), -- 0-360 degrees
  speed decimal(5, 2), -- m/s
  created_at timestamptz default now()
);

-- Performance Indexing
create index idx_live_pings_order_id on live_delivery_pings (order_id);
create index idx_live_pings_created_at on live_delivery_pings (created_at desc);

-- Automated Cleanup Trigger: Keep only last 50 pings per order
create or replace function clean_old_pings() 
returns trigger as $$
begin
  delete from live_delivery_pings
  where order_id = NEW.order_id
  and id not in (
    select id from live_delivery_pings
    where order_id = NEW.order_id
    order by created_at desc
    limit 50
  );
  return NEW;
end;
$$ language plpgsql;

create trigger purge_stale_pings
after insert on live_delivery_pings
for each row execute function clean_old_pings();

-- Automated 'In Transit' Status Update
create or replace function update_order_on_ping() 
returns trigger as $$
begin
  update orders 
  set status = 'shipped' 
  where id = NEW.order_id 
  and status = 'Paid';
  return NEW;
end;
$$ language plpgsql;

create trigger mark_order_in_transit
after insert on live_delivery_pings
for each row execute function update_order_on_ping();

-- Enable Realtime
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime for table live_delivery_pings, orders, driver_missions;
commit;
