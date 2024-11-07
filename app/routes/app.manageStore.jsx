// routes/add-store.jsx
import { useActionData, Form } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { useState } from "react";
import {
  Button,
  FormLayout,
  Page,
  TextField,
  Card,
  Checkbox,
  Layout,
  Select,
} from "@shopify/polaris";
import MapComponent from "../components/MapComponent";

import { storeModel as addStoreToDB } from "../db.server"; // Function to add data to MongoDB

// Define the action function for form submission
export let action = async ({ request }) => {
  const formData = await request.formData();
  const storeName = formData.get("storeName");
  const storeAddress = formData.get("storeAddress");
  const storeCity = formData.get("storeCity");

  // Validate and insert the data into MongoDB
  if (storeName && storeAddress && storeCity) {
    await addStoreToDB({ storeName, storeAddress, storeCity });
    return redirect("app/stores");
  }

  return json({ error: "All fields are required" });
};

// AddStore component
export default function AddStore() {
  const actionData = useActionData();
  const [storeName, setStoreName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [wheelchairAccess, setWheelchairAccess] = useState(false);
  const [wifi, setWifi] = useState(false);
  const [zipCode, setZipCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [storeType, setStoreType] = useState("");
  const [membersClub, setMembersClub] = useState(false);

  return (
    <Page title="Add Store">
    <Layout>
      <Layout.Section secondary>
        <p>Information about the Location</p>
        <p>For step-by-step instructions <a href="/help-center">visit our help center</a></p>
      </Layout.Section>

      <Layout.Section>
        <Card sectioned>
          <Form method="post">
            <FormLayout>
              <FormLayout.Group>
                <TextField
                  label="Store Name *"
                  value={storeName}
                  onChange={(value) => setStoreName(value)}
                  name="storeName"
                  autoComplete="off"
                />
                <TextField
                  label="Address *"
                  value={address}
                  onChange={(value) => setAddress(value)}
                  name="address"
                  autoComplete="off"
                />
              </FormLayout.Group>

              <FormLayout.Group>
                <TextField
                  label="City *"
                  value={city}
                  onChange={(value) => setCity(value)}
                  name="city"
                  autoComplete="off"
                />
                <TextField
                  label="State"
                  value={state}
                  onChange={(value) => setState(value)}
                  name="state"
                  autoComplete="off"
                />
              </FormLayout.Group>

              <FormLayout.Group>
                {/* <Select
                  label="Country *"
                  options={countryOptions}
                  value={country}
                  onChange={(value) => setCountry(value)}
                  name="country"
                /> */}
                <TextField
                  label="Postal/Zip Code"
                  value={zipCode}
                  onChange={(value) => setZipCode(value)}
                  name="zipCode"
                  autoComplete="off"
                />
              </FormLayout.Group>

              <FormLayout.Group>
                <TextField
                  label="Phone Number"
                  value={phoneNumber}
                  onChange={(value) => setPhoneNumber(value)}
                  name="phoneNumber"
                  autoComplete="off"
                />
                <TextField
                  label="Store Type"
                  value={storeType}
                  onChange={(value) => setStoreType(value)}
                  name="storeType"
                  autoComplete="off"
                />
              </FormLayout.Group>

              <FormLayout.Group>
                <TextField
                  label="Longitude"
                  type="number"
                  value={longitude}
                  onChange={(value) => setLongitude(value)}
                  name="longitude"
                  autoComplete="off"
                />
                <TextField
                  label="Latitude"
                  type="number"
                  value={latitude}
                  onChange={(value) => setLatitude(value)}
                  name="latitude"
                  autoComplete="off"
                />
              </FormLayout.Group>

              <FormLayout.Group>
                <Checkbox
                  label="Wheelchair Access"
                  checked={wheelchairAccess}
                  onChange={(newValue) => setWheelchairAccess(newValue)}
                  name="wheelchairAccess"
                />
                <Checkbox
                  label="WiFi Available"
                  checked={wifi}
                  onChange={(newValue) => setWifi(newValue)}
                  name="wifi"
                />
              </FormLayout.Group>

              <Checkbox
                label="Members Club"
                checked={membersClub}
                onChange={(newValue) => setMembersClub(newValue)}
                name="membersClub"
              />
              {actionData?.error && <p style={{ color: "red" }}>{actionData.error}</p>}
              <Button submit primary>Add Store</Button>
            </FormLayout>
          </Form>
        </Card>
      </Layout.Section>
    </Layout>
  </Page>
  );
}
