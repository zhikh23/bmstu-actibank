export function Topbar({ user, onLogin, onLogout }) {
  return (
    <header className="topbar">
      <div className="brand-title">Регистрация мероприятий</div>
      <div className="top-actions">
        {user ? <>
          <div className="user-name">{user.name || user.subject || user.id}</div>
          <div className="avatar">{(user.name || user.subject || 'П').slice(0, 2).toUpperCase()}</div>
          <button className="auth-button" onClick={onLogout}>Выйти</button>
        </> :
          <button className="auth-button" onClick={onLogin}>Войти</button>
        }
      </div>
    </header>
  );
}
