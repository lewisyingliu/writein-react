import AuthService from "../../services/auth.service";

const Profile = () => {
  const currentUser = AuthService.getCurrentUser();

  return (
    <div className="container">
      <header className="jumbotron">
        <h2>
          <strong>User Name: {currentUser.username}</strong>
        </h2>
      </header>
      <h2>
        <strong>Email:</strong> {currentUser.email}
      </h2>
      <h2>
        <strong>Authorities:</strong>
      </h2>
      <h3>
        <ul>{currentUser.roles && currentUser.roles.map((role: string, index: number) => <li key={index}>{role}</li>)}</ul>
      </h3>
    </div>
  );
};

export default Profile;
