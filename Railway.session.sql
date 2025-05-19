DO
$func$
BEGIN
   EXECUTE (
      SELECT string_agg('DROP TABLE IF EXISTS "' || tablename || '" CASCADE;', ' ')
      FROM pg_tables
      WHERE schemaname = 'public'
   );
END
$func$;
