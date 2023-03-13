import { useEffect } from "react";
import Axios from "../../../API/Axios";

const Footer = ({ sendText, setValue, value, file, setFile, setFileKey }) => {
  // const
  const onFileChange = (e) => {
    setFile(e.target.files[0]);
    setValue(e.target.files[0].name);
  };

  useEffect(() => {
    try {
      const getImage = async () => {
        if (file) {
          // console.log('file',file);
          const data = new FormData();
          // data.append('name', file.name);
          data.append("file", file);

          // await uploadFile();
          const response = await Axios.post("/api/image/uploadFile", data, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          // console.log(response);
          setFileKey(response.data.imagePath);
        }
      };
      getImage();
    } catch (err) {
      console.log("error in uploading file");
    }
  }, [file]);

  return (
    <>
      {/*begin::Card footer*/}
      <div className="card-footer pt-4" id="kt_chat_messenger_footer">
        {/*begin::Input*/}
        {/*end::Input*/}
        {/*begin:Toolbar*/}
        <div className="">
          {/*begin::Actions*/}
          <div className="d-flex align-items-center me-2">
            <textarea
              className="form-control form-control-flush mb-3"
              rows={1}
              data-kt-element="input"
              placeholder="Type a message"
              defaultValue={""}
              // onKeyPress={(e) => sendText(e)}
              onChange={(e) => setValue(e.target.value)}
              value={value}
            />
            <button
              className="btn btn-sm btn-icon btn-active-light-primary me-1"
              type="button"
              data-bs-toggle="tooltip"
            >
              <label htmlFor="inputChatFile">
                <i className="bi bi-paperclip fs-3" />
              </label>
              <input
                type="file"
                style={{ display: "none" }}
                id="inputChatFile"
                onChange={(e) => onFileChange(e)}
              />
            </button>
            <button
              className="btn btn-primary"
              type="button"
              data-kt-element="send"
              onClick={() => sendText()}
            >
              Send
            </button>
            {/*
                                                          <button class="btn btn-sm btn-icon btn-active-light-primary me-1" type="button" data-bs-toggle="tooltip" title="Coming soon">
                                                              <i class="bi bi-upload fs-3"></i>
                                                          </button>
      */}
          </div>
          {/*end::Actions*/}
          {/*begin::Send*/}
          {/*end::Send*/}
        </div>
        {/*end::Toolbar*/}
      </div>
      {/*end::Card footer*/}
    </>
  );
};

export default Footer;
