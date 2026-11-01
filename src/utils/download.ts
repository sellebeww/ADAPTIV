/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/** Trigger a browser download for in-memory text. */
export const downloadText = (filename: string, content: string, mime: string) => {
  const url = URL.createObjectURL(new Blob([content], { type: mime }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

const csvCell = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;

export const toCsv = (rows: (string | number)[][]) => '﻿' + rows.map((r) => r.map(csvCell).join(',')).join('\r\n');

export const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
