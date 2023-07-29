# Small Microservices

## ProductsDatabase

Instalation steps:

1. `nest new --strict project-name`
2. `npm install prisma --save-dev`
3. `npx prisma init --datasource-provider sqlite`
4. `npm outdated`
5. Update dependencies
6. Add prisma model
7. `npx prisma migrate dev --name init`
8. `npx prisma generate`
9. install: `npm i -D @swc/cli @swc/core`
10. install: `npm i -D zod zod-validation-error`
11. install: `npm i -D @golevelup/ts-jest`
12. install: `npm i -D jest-mock-extended`
13. install: `npm install --save @nestjs/swagger`
