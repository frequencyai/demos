import React from "react";
import { colors, fonts } from "../theme";

/**
 * Metrics ribbon matching the real Frequency dashboard.
 * Shows 6 key operational metrics in a horizontal strip.
 */
export const MetricsRibbon: React.FC<{
  throughput: string;
  failureRate: string;
  wip: string;
  leadTime: string;
  terminal: string;
  retryDlq: string;
  opacity?: number;
}> = ({ throughput, failureRate, wip, leadTime, terminal, retryDlq, opacity = 1 }) => {
  const cells = [
    { label: "Throughput 24h", value: throughput },
    { label: "Failure Rate", value: failureRate, color: failureRate !== "0%" && failureRate !== "—" ? colors.danger : undefined },
    { label: "WIP", value: wip },
    { label: "Lead Time p50", value: leadTime },
    { label: "Terminal", value: terminal, color: terminal !== "0" && terminal !== "—" ? colors.positive : undefined },
    { label: "Retry / DLQ", value: retryDlq },
  ];

  return (
    <div style={{ display: "flex", gap: 0, opacity }}>
      {cells.map((m, i) => {
        const isDash = m.value === "—";
        return (
          <div
            key={i}
            style={{
              flex: 1,
              padding: "8px 10px",
              border: `1px solid ${colors.borderLight}`,
              marginLeft: i > 0 ? -1 : 0,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <span
              style={{
                fontFamily: fonts.mono,
                fontSize: 9,
                fontWeight: 500,
                textTransform: "uppercase" as const,
                letterSpacing: "0.1em",
                color: colors.textTertiary,
              }}
            >
              {m.label}
            </span>
            <span
              style={{
                fontFamily: fonts.body,
                fontSize: 18,
                fontWeight: 700,
                fontVariantNumeric: "tabular-nums",
                color: m.color || (isDash ? colors.textTertiary : colors.text),
                opacity: isDash ? 0.5 : 1,
              }}
            >
              {m.value}
            </span>
          </div>
        );
      })}
    </div>
  );
};
