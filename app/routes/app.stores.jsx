import {
    Card,
    Layout,
    Page,
    Text,
    DataTable,
    Button,
  } from "@shopify/polaris";
  import { TitleBar } from "@shopify/app-bridge-react";
  import { authenticate } from "../shopify.server";
  import { Form, json, useLoaderData } from "@remix-run/react";
  import { storeModel } from "../db.server";
import { useCallback } from "react";
import connectToDatabase from "../db.connect";
  
  export const loader = async ({ request }) => {
    const { session } = await authenticate.admin(request);
    await connectToDatabase();
    const { shop } = session;
  
    // Fetch all stores associated with the shop
  let stores = [];
   try {
    stores = await storeModel.find({
      shop: shop
    });
   } catch (error) {
    console.log(error);
   }
    return json({ stores });
  };
  
  export default function Stores() {
    const { stores } = useLoaderData();

    const onEdit = async (id) => {
      // Your logic for editing, e.g., navigating to an edit form or modal
      console.log("Edit store with id:", id);
      // Update store information in MongoDB
    }
  
    const onDelete = async (id) => {
      // Confirm delete action
        console.log("Deleted store with id:", id);
    }

    const renderRowActions = useCallback(
      (id) => (
        <>
          <Button onClick={() => onEdit(id)} plain>Edit</Button>
          <Form method="post" action="/app/delete-store">
          <input type="hidden" name="storeId" value={id} />
          <Button submit destructive plain>
            Delete
          </Button>
        </Form>
        </>
      ),
      [onEdit, onDelete]
    );
  
    // Prepare the data for the DataTable
    const rows = stores.map((store) => [
      store.storeName || "N/A",
      store.address || "N/A",
      store.city || "N/A",
      store.state || "N/A",
      store.zipCode || "N/A",
      store.phoneNumber || "N/A",
      renderRowActions(store._id)
    ]);
  
    return (
      <Page>
        <TitleBar title="Stores" />
        <Layout>
          <Layout.Section>
            <Card title="List of Stores" sectioned>
              {stores.length > 0 ? (
                <DataTable
                  columnContentTypes={[
                    'text', // Store Name
                    'text', // Address
                    'text', // City
                    'text', // State
                    'text', // Zip Code
                    'text', // Phone Number
                    "text", // Action
                  ]}
                  headings={[
                    'Store Name',
                    'Address',
                    'City',
                    'State',
                    'Zip Code',
                    'Phone Number',
                    'Action',
                  ]}
                  rows={rows}
                  footerContent={`${stores.length} stores found`}
                />
              ) : (
                <Text>No stores found</Text>
              )}
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }
  