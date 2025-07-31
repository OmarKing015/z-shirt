import { defineQuery } from "next-sanity"
import { sanityFetch } from "../live"

export const getProductBySlug = async (productSlug: string) => {
    const PRODUCT_BY_ID_QUERY = defineQuery(`
    *[
    _type == 'product' &&
    slug.current == $slug
] {
    ...,
    size
} | order(name asc) [0]
    `)

    try {
        const product = await sanityFetch({
            query: PRODUCT_BY_ID_QUERY,
            params: {
                slug: productSlug,
            }
        })
        return product.data || null
    } catch (error) {
        console.error("Error fetching products: " + error)
        return null;
        
    }
}