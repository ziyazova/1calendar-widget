-- Allows a signed-in user to permanently delete their own auth.users row.
-- `widgets` rows cascade-delete via the existing foreign key.
-- SECURITY DEFINER lets the function cross into the auth schema; we restrict
-- the row being deleted to `auth.uid()` so the caller can only delete themselves.

create or replace function public.delete_own_user()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  delete from auth.users where id = auth.uid();
end;
$$;

revoke all on function public.delete_own_user() from public;
grant execute on function public.delete_own_user() to authenticated;
