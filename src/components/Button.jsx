const Button = ({id, className, text, onClick}) => {
    return (
        <button id={id} onClick={onClick} className={`${className ?? ''} cta-wrapper`}>
            <div className="cta-button group">
                <div className="bg-circle" />
                <p className="text">{text}</p>
                <div className="arrow-wrapper">
                    <img src="/images/arrow-down.svg" alt="arrow"/>
                </div>
            </div>
        </button>
    )
}
export default Button
