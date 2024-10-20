import './ChildCard.css'
import avatar from '../assets/student.svg'
import phoneCall from '../assets/phonecall.svg'
import doorOut from '../assets/doorout.svg'
function ChildCard({ childCard, setModal, setActiveChildCard } ) {
    function openModal() {
        setActiveChildCard(prevData=> ({...prevData, fullName: childCard.fullName, id: childCard.id}));
        setModal(true)
    }
    return (
        <div className="childCard" >
            <div className="avatar">
                <img src={avatar} alt="avatar"/>
            </div>

            <div className="childName">{childCard.fullName}</div>
            <div className={"logo-outChild"} onClick={() => openModal()}>
                <img src={doorOut} alt="avatar"/>
            </div>

            <a href={"tel:"+childCard.numberPhone}  className={"logo-phoneCall"}>
                <img  src={phoneCall} alt="phoneCall"/>
            </a>
        </div>
    )
}

export default ChildCard;