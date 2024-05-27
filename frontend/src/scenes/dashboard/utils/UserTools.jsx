import React from "react";
import UserEditCell from "./UserEditCell";

const UserTable = ({
  userid,
  userrole,
  handleDelete,
  handleUpdate,
  handleResetPassword,
  handleUpgradeRole,
  handleDowngradeRole,
}) => {
  return (
    <UserEditCell
      userrole={userrole}
      onDelete={() => handleDelete(userid)}
      onUpdate={() => handleUpdate(userid)}
      onResetPassword={() => handleResetPassword(userid)}
      onUpgradeRole={() => handleUpgradeRole(userid)}
      onDowngradeRole={() => handleDowngradeRole(userid)}
    />
  );
};

export default UserTable;
