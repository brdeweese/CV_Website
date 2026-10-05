/**
 * Introduction to Excel.
 *
 * The activity is a self-contained page in public/labs rather than a React
 * component, so it has its own URL that can be sent to someone directly and
 * opened full screen. Here it is framed inside the activity list.
 */
const LAB_URL = `${import.meta.env.BASE_URL}labs/introduction-to-excel/`

export default function ExcelIntro() {
  return (
    <div className="excel-lab">
      <p className="excel-lab-open">
        <a href={LAB_URL} target="_blank" rel="noopener noreferrer">
          Open the activity full screen (new tab) <span aria-hidden="true">↗</span>
        </a>
      </p>
      <iframe
        className="excel-lab-frame"
        src={LAB_URL}
        title="Introduction to Excel: an interactive activity in a simplified spreadsheet"
        loading="lazy"
      />
    </div>
  )
}
