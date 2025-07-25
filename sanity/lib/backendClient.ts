import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

export const backendClient = createClient({
  apiVersion,
  dataset,
  projectId,
  useCdn: true,
  token: process.env.SANITY_WRITE_TOKEN,
});
