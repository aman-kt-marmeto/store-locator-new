import { TitleBar } from "@shopify/app-bridge-react";
import { BlockStack, Button, Card, Layout, Page, Text } from "@shopify/polaris";

export default function Settings(){

    const handleSettingData = ()=>{
        console.log("Submited");
    }

    return (
        <Page>
          <TitleBar title="Settings" />
          <Layout>
            <Layout.Section>
              <Card>
                <BlockStack gap="300">
                  <Text as="p" variant="bodyMd">
                    
                  </Text>
                </BlockStack>
              </Card>
              <Button onClick={handleSettingData}>Submit</Button>
            </Layout.Section>
          </Layout>
        </Page>
      );
}