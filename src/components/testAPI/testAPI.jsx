import "./style.css";

export default function InfoBox({ info }) {

  console.log("Data:", info);

  return (
    <div id="info-box">
      <h3>Server Status: {info.status}</h3>
      <p>Version: {info.version}</p>
      <p>Menu Items: {info.menu_items.join(", ")}</p>
    </div>
  );
}