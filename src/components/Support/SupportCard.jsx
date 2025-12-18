import React from "react";

const SupportCard = ({
  icon,
  title,
  description,
  btnText,
  btnIcon,
  onClick,
  colorClass,
  delay,
}) => {

  const getColors = (type) => {
    switch (type) {
      case "primary":
        return {
          bg: "var(--dash-primary-light)",
          color: "var(--dash-primary-color)",
        };
      case "secondary":
        return {
          bg: "var(--dash-secondary-light)",
          color: "var(--dash-secondary-color)",
        };
      case "warning":
        return {
          bg: "var(--dash-warning-light)",
          color: "var(--dash-warning-color)",
        };
      case "info":
        return {
          bg: "var(--dash-info-light)",
          color: "var(--dash-info-color)",
        };
      case "danger":
        return {
          bg: "color-mix(in srgb, var(--dash-danger-color) 15%, transparent)",
          color: "var(--dash-danger-color)",
        };
      case "purple":
        return {
          bg: "color-mix(in srgb, var(--dash-purple-color) 15%, transparent)",
          color: "var(--dash-purple-color)",
        };
      default:
        return {
          bg: "var(--dash-border-color)",
          color: "var(--dash-text-muted)",
        };
    }
  };

  const { bg, color } = getColors(colorClass);

  return (
    <div
      className="dash-card dash-support-card dash-animate-in"
      style={{ animationDelay: delay }}
    >
      <div
        className="dash-support-icon-wrapper"
        style={{ backgroundColor: bg }}
      >
        <i className={`${icon}`} style={{ color: color }}></i>
      </div>
      <h3>{title}</h3>
      <p className="dash-field">{description}</p>
      <div className="dash-actions">
        <button className="dash-button dash-button-sm" onClick={onClick}>
          <i className={`${btnIcon}`}></i> {btnText}
        </button>
      </div>
    </div>
  );
};

export default SupportCard;
