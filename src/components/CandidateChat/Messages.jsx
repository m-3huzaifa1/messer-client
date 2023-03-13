import Footer from "./Footer";
import { useContext, useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import useAuth from "../../../Hooks/useAuth";
import Axios, { BASE_URL } from "../../../API/Axios";
import { useParams } from "react-router-dom";

const Messages = ({ conversation }) => {
  const [company, setCompany] = useState();
  const { auth } = useAuth();
  const socket = auth.socket;
  const [value, setValue] = useState();
  const [messages, setMessages] = useState([]);
  const [incomingMessage, setIncomingMessage] = useState(null);
  const [newMessageFlag, setNewMessageFlag] = useState(false);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState();
  const [fileKey, setFileKey] = useState("");
  const senderId = auth?.foundUser?._id;
  const backend_url = `${BASE_URL}/api/image`;

  const scrollRef = useRef();
  const companyId = useParams().companyId;
  const recieverId = company?.recruiterid;

  useEffect(() => {
    console.log("inside conversations.jsx line 34");
    socket.emit("addUser", senderId);
    socket.on("getUsers", (data) => {
      console.log(data);
      //  setActiveUsers(data);
    });
    //  console.log(activeUsers);
  }, []);

  // useEffect for fetching company details
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getCompany = async () => {
      try {
        const res = await Axios.get(
          `/api/can/getRecruiterDetails/${companyId}`,
          {
            signal: controller.signal,
          }
        );
        console.log("response", res?.data[0]);

        const newData = await res?.data[0];
        isMounted && setCompany(newData);
        if (company === undefined) {
          setLoading(true);
        } else {
          setLoading(false);
        }

        console.log(company);
      } catch (err) {
        console.log(err);
      }
    };
    getCompany();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  // socket for listening to the incoming message

  useEffect(() => {
    socket.on("getMessage", (data) => {
      // console.log("getting message", data);
      const {senderId, text,Date,type,fileKey,targetId} = data;
      if(targetId ==  auth?.foundUser?._id){
      setIncomingMessage({
        senderId,
        text,
        Date,
        type,
        fileKey
      });}
    });
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ transition: "smooth" });
  }, [messages]);

  // setting the new incoming message into the message
  useEffect(() => {
    console.log("In incoming message", incomingMessage);
    if (incomingMessage && incomingMessage.senderId == recieverId) {
      console.log("yesss setting message");
      setMessages((prev) => [...prev, incomingMessage]);
    }
    // setNewMessageFlag((prev) => !prev);
  }, [incomingMessage]);

  //  recieving message

  useEffect(() => {
    const getMessage = async () => {
      // if(incomingMessage){
      console.log("candidate ", auth);
      const data = {
        candidateId: senderId,
        recruiterId: recieverId,
      };
      const response = await Axios.post(
        "/api/message/getConversation",
        JSON.stringify(data),
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setMessages(response.data.message);
      // }}
    };
    getMessage();
  }, [recieverId, senderId, conversation, newMessageFlag]);

  // send a new message
  const sendText = async (e) => {
    //   console.log(value);
    if (!value) return;
    try {
      if (true) {
        let message = {};
        if (!file) {
          message = {
            senderId: senderId,
            candidateId: senderId,
            recruiterId: recieverId,
            text: value,
            type: "text",
            fileKey: null,
          };
        } else {
          message = {
            senderId: senderId,
            candidateId: senderId,
            recruiterId: recieverId,
            text: value,
            type: "file",
            fileKey: fileKey,
          };
        }
        
        socket.emit(
          "sendMessage",
          {
            senderId,
            recieverId,
            text: value,
            Date: Date.now(),
            type: message.type,
            fileKey: message.fileKey
          },
          (res) => console.log(res)
        );

        const response = await Axios.post(
          "/api/message/addConversation",
          JSON.stringify(message),
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        
        console.log(response);

        await Axios.post(
          "/api/rec/messagenotification",
          JSON.stringify({
            companyid: companyId,
            user: auth?.foundUser?.name,
            message: value,
          }),
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        )
        .then(res=>console.log(res))
        .catch(err=>console.log(err))
        
        setValue("");
        setFile("");
        setFileKey("");
        setNewMessageFlag((prev) => !prev);
      }
    } catch (err) {
      console.log("Error in adding message", err);
    }
  };

  const formatDate = (data) => {
    let hrs = new Date(data).getHours();
    let mins = new Date(data).getMinutes();
    hrs = hrs < 10 ? "0" + hrs : hrs;
    mins = mins < 10 ? "0" + mins : mins;
    return `${hrs}:${mins}`;
  };

  const downloadMedia = async (e, originalImage, fileName) => {
    e.preventDefault();
    try {
      console.log(originalImage);
      fetch(originalImage)
        .then((resp) => {
          console.log(resp);
          return resp.blob();
        })
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          console.log("blob", url, blob);
          const a = document.createElement("a");
          a.style.display = "none";
          a.href = url;

          const nameSplit = originalImage.split("/");
          const duplicateName = nameSplit.pop();

          // the filename you want
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
        })
        .catch((error) =>
          console.log("Error while downloading the image ", error)
        );
    } catch (error) {
      console.log("Error while downloading the image ", error);
    }
  };

  return (
    <>
      {/*begin::Messenger*/}
      <div
        className="card"
        id="kt_chat_messenger"
        // style={{ overflowY: "scroll", height: "90vh" }}
      >
        {/*begin::Card header*/}
        <div className="card-header" id="kt_chat_messenger_header">
          {/*begin::Title*/}
          <div className="card-title">
            {/*begin::User*/}
            <div className="d-flex justify-content-center flex-column me-3">
              <a
                href="#"
                className="fs-4 fw-bolder text-gray-900 text-hover-primary me-1 mb-2 lh-1"
              >
                {company?.companyName}{" "}
              </a>
              {/*begin::Info*/}
              <div className="mb-0 lh-1">
                <span className="badge badge-success badge-circle w-10px h-10px me-1" />
                <span className="fs-7 fw-bold text-muted">Active</span>
              </div>
              {/*end::Info*/}
            </div>
            {/*end::User*/}
          </div>
          {/*end::Title*/}
          {/*begin::Card toolbar*/}
          <div className="card-toolbar">
            {/*begin::Menu*/}
            <div
              id="datepicker"
              className="input-group date"
              data-date-format="mm-dd-yyyy"
            >
              {/* <input className="form-control" type="text" readOnly="" /> */}
              <span className="input-group-addon">
                <i className="glyphicon glyphicon-calendar" />
              </span>
            </div>
            <div className="me-n3" style={{ right: 0, position: "absolute" }}>
              <button
                className="btn btn-sm btn-icon btn-active-light-primary"
                data-kt-menu-trigger="click"
                data-kt-menu-placement="bottom-end"
              >
                <i className="bi bi-three-dots fs-2" />
              </button>
              {/*begin::Menu 3*/}
              <div
                className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg-light-primary fw-bold w-200px py-3"
                data-kt-menu="true"
              >
                {/*begin::Menu item*/}
                <div className="menu-item px-3">
                  <a href="#" className="menu-link px-3">
                    Contact Details
                  </a>
                </div>
                {/*end::Menu item*/}
                {/*begin::Menu item*/}
                <div className="menu-item px-3">
                  <a href="#" className="menu-link px-3">
                    Send Assignment
                  </a>
                </div>
                {/*end::Menu item*/}
                {/*begin::Menu item*/}
                <div className="menu-item px-3 my-1">
                  <a
                    href="#"
                    className="menu-link px-3"
                    style={{ color: "red" }}
                  >
                    Chat Close
                  </a>
                </div>
                {/*end::Menu item*/}
              </div>
              {/*end::Menu 3*/}
            </div>
            {/*end::Menu*/}
          </div>
          {/*end::Card toolbar*/}
        </div>
        {/*end::Card header*/}
        {/*begin::Card body*/}
        <div
          className="card-body"
          id="kt_chat_messenger_body"
          style={{ overflowY: "scroll", height: "76vh" }}
        >
          {/*begin::Messages*/}
          <div
            className="scroll-y me-n5 pe-5 h-300px h-lg-auto"
            data-kt-element="messages"
            data-kt-scroll="true"
            data-kt-scroll-activate="{default: false, lg: true}"
            data-kt-scroll-max-height="auto"
            data-kt-scroll-dependencies="#kt_header, #kt_toolbar, #kt_footer, #kt_chat_messenger_header, #kt_chat_messenger_footer"
            data-kt-scroll-wrappers="#kt_content, #kt_chat_messenger_body"
            data-kt-scroll-offset="5px"
          >
            {messages
              ? messages.map((item) => {
                  // item.senderId == companyId ?
                  return (
                    // {
                    item.senderId != senderId ? (
                      <>
                        {/*begin::Message(in)*/}
                        <div
                          className="d-flex justify-content-start mb-10"
                          ref={scrollRef}
                        >
                          {/*begin::Wrapper*/}
                          <div className="d-flex flex-column align-items-start">
                            {/*begin::User*/}
                            <div className="d-flex align-items-center mb-2">
                              {/*begin::Avatar*/}
                              <div className="symbol symbol-35px symbol-circle">
                                <img
                                  alt="Pic"
                                  src={
                                    company?.image
                                      ? `${backend_url}${company?.image}`
                                      : "/../assets/media/avatars/300-25.jpg"
                                  }
                                />
                              </div>
                              {/*end::Avatar*/}
                              {/*begin::Details*/}
                              <div className="ms-3">
                                <a
                                  href="#"
                                  className="fs-5 fw-bolder text-gray-900 text-hover-primary me-1"
                                >
                                  {company?.companyName}
                                </a>
                                <span className="text-muted fs-7 mb-1 p-4">
                                  {formatDate(item.Date)}
                                </span>
                              </div>
                              {/*end::Details*/}
                            </div>
                            {/*end::User*/}
                            {/*begin::Text*/}
                            {item?.type == "file" &&
                            !item?.text?.includes(".pdf") ? (
                              <>
                                <img
                                  src={`${backend_url}${item.fileKey}`}
                                  style={{
                                    width: 300,
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                />
                                <div
                                  className="p-5 rounded bg-light-info text-dark fw-bold mw-lg-400px text-start"
                                  data-kt-element="message-text"
                                >
                                  {item?.text}
                                  <i
                                    class="bi bi-download p-5"
                                    onClick={(e) =>
                                      downloadMedia(
                                        e,
                                        `${backend_url}${item.fileKey}`,
                                        item.text
                                      )
                                    }
                                  ></i>
                                </div>
                              </>
                            ) : item?.type == "file" &&
                              item?.text?.includes(".pdf") ? (
                              <>
                                <img
                                  src={`https://icones.pro/wp-content/uploads/2021/03/icone-pdf-symbole-png-rouge.png`}
                                  style={{
                                    width: 100,
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                />
                                <div
                                  className="p-5 rounded bg-light-info text-dark fw-bold mw-lg-400px text-start"
                                  data-kt-element="message-text"
                                >
                                  {item?.text}
                                  <i
                                    class="bi bi-download p-5"
                                    onClick={(e) =>
                                      downloadMedia(
                                        e,
                                        `${backend_url}${item.fileKey}`,
                                        item.text
                                      )
                                    }
                                  ></i>
                                </div>
                              </>
                            ) : (
                              <div
                                className="p-5 rounded bg-light-info text-dark fw-bold mw-lg-400px text-start"
                                data-kt-element="message-text"
                              >
                                {item?.text}
                              </div>
                            )}

                            {/*end::Text*/}
                          </div>
                          {/*end::Wrapper*/}
                        </div>
                        {/*end::Message(in)*/}
                      </>
                    ) : (
                      <>
                        {/*begin::Message(out)*/}
                        <div
                          className="d-flex justify-content-end mb-10"
                          ref={scrollRef}
                        >
                          {/*begin::Wrapper*/}
                          <div className="d-flex flex-column align-items-end">
                            {/*begin::User*/}
                            <div className="d-flex align-items-center mb-2">
                              {/*begin::Details*/}
                              <div className="me-3">
                                <span className="text-muted fs-7 mb-1 p-4">
                                  {formatDate(item.Date)}
                                </span>
                                <a
                                  href="#"
                                  className="fs-5 fw-bolder text-gray-900 text-hover-primary ms-1"
                                >
                                  You
                                </a>
                              </div>
                              {/*end::Details*/}
                              {/*begin::Avatar*/}
                              <div className="symbol symbol-35px symbol-circle">
                                <img
                                  alt="Pic"
                                  src={
                                    auth?.candidate?.image
                                      ? `${backend_url}${auth?.candidate?.image}`
                                      : "../assets/media/avatars/300-1.jpg"
                                  }
                                />
                              </div>
                              {/*end::Avatar*/}
                            </div>
                            {/*end::User*/}
                            {/*begin::Text*/}
                            {item?.type == "file" &&
                            !item?.text?.includes(".pdf") ? (
                              <>
                                <img
                                  src={`${backend_url}${item.fileKey}`}
                                  style={{
                                    width: 300,
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                />
                                <div
                                  className="p-5 rounded bg-light-info text-dark fw-bold mw-lg-400px text-start"
                                  data-kt-element="message-text"
                                >
                                  {item?.text}
                                  <i
                                    class="bi bi-download p-5"
                                    onClick={(e) =>
                                      downloadMedia(
                                        e,
                                        `${backend_url}${item.fileKey}`,
                                        item.text
                                      )
                                    }
                                  ></i>
                                </div>
                              </>
                            ) : item?.type == "file" &&
                              item?.text?.includes(".pdf") ? (
                              <>
                                <img
                                  src={`https://icones.pro/wp-content/uploads/2021/03/icone-pdf-symbole-png-rouge.png`}
                                  style={{
                                    width: 100,
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                />
                                <div
                                  className="p-5 rounded bg-light-info text-dark fw-bold mw-lg-400px text-start"
                                  data-kt-element="message-text"
                                >
                                  {item?.text}
                                  <i
                                    class="bi bi-download p-5"
                                    onClick={(e) =>
                                      downloadMedia(
                                        e,
                                        `${backend_url}${item.fileKey}`,
                                        item.text
                                      )
                                    }
                                  ></i>
                                </div>
                              </>
                            ) : (
                              <div
                                className="p-5 rounded bg-light-info text-dark fw-bold mw-lg-400px text-start"
                                data-kt-element="message-text"
                              >
                                {item?.text}
                              </div>
                            )}
                            {/*end::Text*/}
                          </div>
                          {/*end::Wrapper*/}
                        </div>
                        {/*end::Message(out)*/}
                      </>
                    )
                  );
                })
              : "Start Conversation with the recruiter."}
          </div>
          {/*end::Messages*/}
        </div>
        {/*end::Card body*/}
      </div>
      {/*end::Messenger*/}
      <Footer
        sendText={sendText}
        value={value}
        setValue={setValue}
        file={file}
        setFile={setFile}
        setFileKey={setFileKey}
      ></Footer>
    </>
  );
};

export default Messages;
