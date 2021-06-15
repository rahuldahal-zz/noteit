import LogoutButton from "@components/Buttons/LogoutButton";
import { useAuth } from "@contexts/AuthProvider";
import React from "react";
import Clock from "@svgs/clock.svg";
import Choice from "@svgs/choice.svg";
import GraduationCap from "@svgs/graduationCap.svg";
import Devices from "@svgs/devices.svg";
import TextWithIcon from "@components/TextWithIcon";
import getIconPaths from "@utils/iconDetails";
import Button from "@components/Buttons/Button";

export default function UserProfile({ isScreenWide }) {
  const { user } = useAuth();

  function NameAndPicture() {
    return (
      <div className="profile__general">
        <div className="profile__picture">
          <img src={user.picture} width="140px" height="140px" alt="" />
        </div>
        <h4 className="profile__name">{`${user.firstName} ${user.lastName}`}</h4>
      </div>
    );
  }

  function Datum({ Icon, name, value }) {
    return (
      <div className="profile__datum datum">
        {<Icon className="datum__icon" /> || <small>ICOn here</small>}
        <span className="datum__content">
          <strong className="datum__title">{name}</strong>
          <small className="datum__value">{value}</small>
        </span>
      </div>
    );
  }

  function Status() {
    return (
      <div className="profile__status">
        <p>
          <strong>About</strong>
        </p>
        <div className="profile__data">
          <Datum
            Icon={Clock}
            name="Joined On"
            value={new Date(user.joinedOn).toLocaleString().split(",")[0]}
          />
          <Datum Icon={Devices} name="Session" value={user.sessionCount} />
        </div>
      </div>
    );
  }

  function Subscription() {
    return (
      <div className="profile__subscription">
        <p>
          <strong>Subscription</strong>
        </p>
        <div className="profile__data">
          <Datum Icon={Choice} name="Type" value="basic" />
          <Datum
            Icon={GraduationCap}
            name="Course"
            value={`${user.faculty.toUpperCase()} ${user.semester}`}
          />
        </div>
        <Button type="button">
          <TextWithIcon
            textContent="Upgrade"
            pathData={getIconPaths("ascending")}
            iconWidth="2rem"
          />
        </Button>
      </div>
    );
  }

  return (
    <div className="profile">
      <div className="profile__content">
        <NameAndPicture />
        <Status />
        <Subscription />
        <LogoutButton className="profile__logout" />
      </div>
    </div>
  );
}
