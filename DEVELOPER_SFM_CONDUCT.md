# SFM Code Conduct (Main App)

This project uses page-based SFM codes in the MAIN APP and legacy numeric SFM codes only in the FREE CALCULATOR. Follow these rules to avoid breaking allocations and UI sequencing:

- Do not add or allocate new SFM codes without explicit instruction.
- Use page-based SFM codes strictly on their own page; do not display codes from one page on another.
- Do not use or reference the deprecated numeric resolver in the MAIN APP.
- Maintain output order: compute and present values in the same top-to-bottom, left-to-right sequence as the UI.
- Do not place descriptive text in the SFM badge area; badges show the ID only.
- Reuse values by their existing SFM IDs (e.g., reuse `SFM-APF-4201-M` for Salary Sacrifice on Step 5).

If in doubt: stop, check `src/data/systemFields/pageBasedSFMFields.ts`, and request allocation guidance before coding.