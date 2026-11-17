create table public.event_private (
  event_id uuid primary key references public.events (id) on delete cascade,
  submitter_name text,
  submitter_email text,
  admin_notes text,
  rejection_reason text,
  constraint event_private_submitter_name_not_blank
    check (submitter_name is null or length(trim(submitter_name)) > 0),
  constraint event_private_submitter_email_format
    check (submitter_email is null or submitter_email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$')
);

alter table public.event_private enable row level security;