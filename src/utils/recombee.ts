import recombee from "recombee-api-client";
console.log(process.env.RECOMBEE_DEV_DATABASE_ID);

export const client = new recombee.ApiClient(process.env.RECOMBEE_DEV_DATABASE_ID || "",process.env.RECOMBEE_DEV_PRIVATE_TOKEN || "",{
    region:'us-west',
});