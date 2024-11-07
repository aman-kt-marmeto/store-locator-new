import { json } from "@remix-run/node";
import { Page, Layout, Banner, Card, Button, TextContainer, Stack } from "@shopify/polaris";
import { Link } from "@remix-run/react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  return json({ok:true  });
};

export default function Index() {
 
  return (
    <Page title="Dashboard">
    {/* Top Notification Banner */}
    <Banner
      title="Annual plans are here!"
      status="info"
      onDismiss={() => {}}
    >
      <p>2 Months Free with Annual Subscription!</p>
      <Button primary>Upgrade</Button>
    </Banner>

    {/* Getting Started Section */}
    <Layout>
      <Layout.Section>
        <Card
          title="Getting started"
          sectioned
          secondaryFooterActions={[
            {
              content: "Contact support",
              url: "/support",
            },
          ]}
          primaryFooterAction={{
            content: "Knowledge base",
            url: "/knowledge-base",
          }}
        >
          <TextContainer>
            <p>1. Create a store location by adding a new one or importing from an existing list.</p>
            <p>2. Add a store map to your Shopify store via the Theme customization app block or the Store Locator proxy page.</p>
            <p>3. Customize the look of your map on the "Display settings" page.</p>
            <p>
              If you encounter any issues during installation, <Link to="/support">Contact support</Link> or refer to the Knowledge base.
            </p>
          </TextContainer>
        </Card>
      </Layout.Section>

      {/* Action Buttons Section */}
      <Layout.Section>
        <Stack distribution="equalSpacing">
          <Card title="Add location" sectioned>
            <Stack vertical spacing="tight" alignment="center">
              <div style={{ fontSize: "40px" }}>📍</div>
              <TextContainer>
                <p>
                  Enhance your Shopify store with our store locator feature, enabling customers to easily find physical store locations. Add your location and details including store name, working hours, and extra fields that you may need.
                </p>
              </TextContainer>
              <Button primary>Add location</Button>
            </Stack>
          </Card>

          <Card title="Add app block" sectioned>
            <Stack vertical spacing="tight" alignment="center">
              <div style={{ fontSize: "40px" }}>🔲</div>
              <TextContainer>
                <p>
                  If you're using a modern theme and want to add a store map to a specific page, add it as an app block on the Theme Customizer page.
                </p>
              </TextContainer>
              <Button primary>Add app block</Button>
            </Stack>
          </Card>

          <Card title="Onboarding call" sectioned>
            <Stack vertical spacing="tight" alignment="center">
              <div style={{ fontSize: "40px" }}>📞</div>
              <TextContainer>
                <p>
                  Need Assistance with App Setup or Customization? Schedule your session and enhance your app experience with expert guidance!
                </p>
              </TextContainer>
              <Button primary>Book a call</Button>
            </Stack>
          </Card>
        </Stack>
      </Layout.Section>
    </Layout>
  </Page>
  );
}
