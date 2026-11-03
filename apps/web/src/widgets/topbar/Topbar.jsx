export function Topbar({ authenticated, onLogin, onLogout }) {
  return (
    <header className="topbar">
      <div className="brand-title">Регистрация мероприятий</div>
      <div className="top-actions">
        {authenticated ? <>
          <div className="user-name">Иванов Иван</div>
          <div className="avatar">ИИ</div>
          <button className="auth-button" onClick={onLogout}>Выйти</button>
        </> :
          <button className="auth-button" onClick={onLogin}>Войти</button>
        }
      </div>
    </header>
  );
}
