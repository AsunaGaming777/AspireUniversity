-- Update user role to overseer (highest access level)
-- Run this with: psql $DATABASE_URL -f scripts/update-user-role.sql

UPDATE "users" 
SET role = 'overseer' 
WHERE email = 'azer.kasim@icloud.com';

-- If user doesn't exist, create them
INSERT INTO "users" (id, email, role, "createdAt", "updatedAt", "emailVerified")
VALUES (
  gen_random_uuid()::text,
  'azer.kasim@icloud.com',
  'overseer',
  NOW(),
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE SET role = 'overseer';

-- Verify the update
SELECT id, email, role, name, "createdAt" 
FROM "users" 
WHERE email = 'azer.kasim@icloud.com';
