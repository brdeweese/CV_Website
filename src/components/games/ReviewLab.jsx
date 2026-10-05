/**
 * The Care and Stay Review Lab.
 *
 * The lab is a self-contained page in public/labs rather than a React
 * component, so it has its own URL that can be sent to someone directly and
 * opened full screen. Here it is framed inside the activity list.
 */
const LAB_URL = `${import.meta.env.BASE_URL}labs/care-and-stay/`

export default function ReviewLab() {
  return (
    <div className="reviewlab">
      <p className="reviewlab-open">
        <a href={LAB_URL} target="_blank" rel="noopener noreferrer">
          Open the lab full screen (new tab) <span aria-hidden="true">↗</span>
        </a>
      </p>
      <iframe
        className="reviewlab-frame"
        src={LAB_URL}
        title="Care and Stay Review Lab: an interactive Excel practice tool"
        loading="lazy"
      />
    </div>
  )
}
