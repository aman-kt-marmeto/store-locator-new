import {
  Box,
  Card,
  Layout,
  Link,
  List,
  Page,
  Text,
  BlockStack,
  DropZone,
  Button,
} from "@shopify/polaris";

import { LegacyStack, Thumbnail} from '@shopify/polaris';
import {NoteIcon} from '@shopify/polaris-icons';
import {useState, useCallback} from 'react';
import Papa from "papaparse";

import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { data, useSubmit } from "@remix-run/react";

import { storeModel } from "../db.server";



export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

export const action = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const { shop } = session;
  const {file} = Object.fromEntries(await request.formData());

  let storeData =  JSON.parse(file);
  storeData.map( async (mydata,index)=>{
    if(mydata){
     let  longitude = mydata['Longitude'] ? parseFloat(mydata['Longitude']) : 0.0;
     let  latitude = mydata['Latitude'] ? parseFloat(mydata['Latitude']) : 0.0;
      //checking long lat, if there are not available we will call google geocoding api 
      if( !parseFloat(mydata['Longitude']) || !parseFloat(mydata['Latitude'])){
        let google_url = `https://maps.googleapis.com/maps/api/geocode/json?address=${mydata['Address']+",+"+mydata['City']+",+"+mydata['State']+",+"+mydata['Country']}&key=AIzaSyAi5q86olTxfcAwSH9KN76hNiLHxp6eBrY`
        let OLA_url = `https://api.olamaps.io/places/v1/geocode?address=${mydata['Address']+",+"+mydata['City']+",+"+mydata['State']+",+"+mydata['Country']}&api_key=JiyFD7qzLOQyaDdL7Cm4E3TdzBRgYzSIObU8R3Gy`
        const resData = await fetch(OLA_url);
        const bbData = await resData.json()
        longitude = parseFloat( bbData.geocodingResults[0].geometry.location.lng)
        latitude  = parseFloat(bbData.geocodingResults[0].geometry.location.lat)
      }

      try {
        const insertData = {
          shop: shop,
          storeName: mydata['Store Name'] || "",
          address: mydata['Address'] || "",
          city: mydata['City'] || "",
          state: mydata['State'] || "",
          country: mydata['Country'] || "",
          location:{
            coordinates:[longitude, latitude],
          },
          wheelchairAccess: mydata['Wheelchair Access'] === 'Y',
          wifi: mydata['Wi-Fi'] === 'Y',
          zipCode: mydata['Zip Code'] || "",
          phoneNumber: mydata['Phone Number'] || "",
          storeType: mydata['Store Type'] || "",
          membersClub: mydata['Members Club'] === 'Y'
        }
        await storeModel.create(insertData)
      } catch (error) {
        console.log(error, "RED FLAG");
      }
    }
  
  })
  return null;
};



export default function AdditionalPage() {

  const submit =   useSubmit()
  const [files, setFiles] = useState([]);
  const [data, setData ] = useState([])
  const fileUpload = !files.length && <DropZone.FileUpload />;

  const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];

  const uploadedFiles = files.length > 0 && (
    <div style={{padding: '0'}}>
      <LegacyStack vertical>
        {files.map((file, index) => (
          <LegacyStack alignment="center" key={index}>
            {/* <Thumbnail
              size="small"
              alt={file.name}
              source={window.URL.createObjectURL(file)}
            /> */}
            <div>
              {file.name}{' '}
              <Text variant="bodySm" as="p">
                {file.size} bytes
              </Text>
            </div>
          </LegacyStack>
        ))}
      </LegacyStack>
    </div>
  );

  const handleDropZoneDrop = useCallback(
    (_dropFiles, acceptedFiles, _rejectedFiles) =>
      {
        setFiles((files) => [...files, ...acceptedFiles])
        console.log(files);
      },
    [],
  );

  const handleCSV = async()=>{
    if (!files) return alert("Enter a valid file")
    const formData = new FormData();
    Papa.parse(files[0], {
      complete: (result) => {
          setData(result.data);
      },
      header: true,
  })
  formData.append("file",JSON.stringify(data));
  submit(formData, { method: "post" });
    console.log(data);
  }


  return (
    <Page>
      <TitleBar title="Additional page" />
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="300">
              <Text as="p" variant="bodyMd">
                Upload File CSV
              </Text>
              <DropZone onDrop={handleDropZoneDrop}>
                {uploadedFiles}
                {fileUpload}
              </DropZone>
              <Button size="medium" variant="primary" onClick={handleCSV}>Upload</Button>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

function Code({ children }) {
  return (
    <Box
      as="span"
      padding="025"
      paddingInlineStart="100"
      paddingInlineEnd="100"
      background="bg-surface-active"
      borderWidth="025"
      borderColor="border"
      borderRadius="100"
    >
      <code>{children}</code>
    </Box>
  );
}
