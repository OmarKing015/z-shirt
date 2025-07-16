import { ShoppingBasketIcon } from "lucide-react";
import { defineArrayMember, defineField, defineType } from "sanity";

export const orderType = defineType({
  name: "order",
  title: "Order",
  type: "document",
  icon: ShoppingBasketIcon,
  fields: [
    defineField({
      name: "orderNumber",
      title: "Order Number",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "CustomerName",
      title: "Customer Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "PaymobUserCheckOutId",
      title: "User Paymob Checkout ID",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "checkoutId",
      title: "Checkout ID",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "PaymobPaymobIntentId",
      title: "Paymob Intent ID",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "products",
      title: "Products",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "product",
              title: "Product Bought",
              type: "reference",
              validation: (rule) => rule.required(),
              to: [{ type: "product" }],
            }),
            defineField({
              name: "quantity",
              title: "Quantity",
              type: "number",
              validation: (rule) => rule.required().min(1),
            }),
          ],
          preview: {
            select: {
              product: "product.name",
              quantity: "quantity",
              image: "product.images[0].asset",
              price: "product.discountedPrice || product.price",
              currency: "product.currency",
            },
            prepare(_select) {
              return {
                title: _select.product,
                subtitle: `${_select.quantity} x ${_select.price} ${_select.currency}`,
                media: _select.image,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "totalPrice",
      title: "Total Price",
      type: "number",
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: "currency",
      title: "Currency",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "amountDiscount",
      title: "Amount Discount",
      type: "number",
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Paid", value: "paid" },
          { title: "Shipped", value: "shipped" },
          { title: "Delivered", value: "delivered" },
          { title: "Cancelled", value: "cancelled" },
        ],
      },
    }),
    defineField({
      name: "orederDate",
      title: "Order Date",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "orderNumber",
      subtitle: "CustomerName",
    },
    prepare(_select) {
      return {
        title: _select.title,
        subtitle: _select.subtitle,
      };
    },
  },
});
