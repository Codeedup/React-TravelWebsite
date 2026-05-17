export default function SidebarPanel({ title, meta, children, action }) {
  return (
    <section className="sidebar-panel hud-panel">
      <div className="panel-title-row">
        <h2>{title}</h2>
        {meta && <span>{meta}</span>}
      </div>
      <div className="panel-body">{children}</div>
      {action && <div className="panel-action">{action}</div>}
    </section>
  );
}
