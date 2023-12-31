import React, { useEffect } from "react";
import { SubmitButton } from "../../utils/SubmitButtonHandler";
import { schema } from ".";
import RJSFFormHandler from "../../utils/RJSFFormHandler";
import { useNavigate, useParams } from "react-router-dom";
import useAxiosFetcher from "../../../api/Fetcher";
import { Toast } from "../../../components/alerts";
import Loader from "../../../components/Loader";
import { getTokenCookie } from "../../../api/TokenManager";

const uiSchema = {
  title: {
    "ui:autofocus": true,
  },
};

function ContactNew() {
  const { post, get, data, error, loading } = useAxiosFetcher();
  const { userid } = useParams();
  const router = useNavigate();

  const onSubmit = ({ formData }) => {
    if (loading) return;
    post(`/api/contact/${userid}`, [
      formData,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${getTokenCookie()}`,
        },
      },
    ]);
  };
  useEffect(() => {
    if (error) {
      Toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      if (typeof data.message === "string" && data.status) {
        Toast.success(data.message);
        router(`/${userid}/contact`);
      }
    }
  }, [data]);

  useEffect(() => {
    get(`/api/contact/${userid}`);
  }, []);

  const props = {
    uiSchema,
    schema,
    SubmitButton: () => <SubmitButton name="create" color="primary" />,
    onSubmit,
  };

  return (
    <div
      style={{ maxWidth: "800px", margin: "0 auto" }}
      className="d-flex flex-column gap-3 position-relative"
    >
      <div className="alert alert-primary" role="alert">
        <strong>Use this forms to create your contact details</strong>
      </div>
      {loading ? <Loader /> : FormData && <RJSFFormHandler {...props} />}
    </div>
  );
}

export default ContactNew;
