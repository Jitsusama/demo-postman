import {useEffect, useRef, useState} from 'react'
import style from './app.module.css'

const DEFAULT_BASEURI = 'http://127.0.0.1:8080';

export const App = () => {
    const [state, setState] = useState('loggedOut');
    const [baseUri, setBaseUri] = useState(DEFAULT_BASEURI)
    useEffect(() => {
        const oldBaseUri = window.sessionStorage.getItem('baseUri')
        if (oldBaseUri && baseUri === DEFAULT_BASEURI)
            setBaseUri(oldBaseUri)
        else if (!oldBaseUri || oldBaseUri !== baseUri)
            window.sessionStorage.setItem('baseUri', baseUri)
    }, [baseUri])

    const login = () => setState('loggedIn')
    const logout = () => setState('loggedOut')

    return <main className={style.app}>
        <BaseUri value={baseUri} onChange={v => setBaseUri(v)}/>
        {state === 'loggedOut'
            ? <Login baseUri={baseUri} onLogin={login}/>
            : <LastLogin baseUri={baseUri} onLogout={logout}/>}
    </main>;
};

const BaseUri = ({value, onChange}) => (
    <form onSubmit={e => e.preventDefault()} className={style.baseUri}>
        <input type="text" value={value} title="Remote API Base URI"
               onChange={e => onChange(e.target.value)}/>
    </form>
)

const Login = ({baseUri, onLogin}) => {
    /** @type {{current:HTMLElement}} */
    const ref = useRef()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [state, setState] = useState('initial')
    useEffect(() => state === 'initial' && ref.current.focus(), [state])

    const disabled = state === 'processing'
    const onSubmit = (event) => {
        event.preventDefault();
        (async () => {
            setState('processing');
            try {
                const params = new URLSearchParams({username, password})
                const response = await fetch(`${baseUri}/login?${params}`)
                if (!response.ok) setState('error')
                else onLogin()
            } catch (error) {
                setState('error')
            }
        })()
    }

    return <section tabIndex="-1" ref={ref}>
        <form onSubmit={onSubmit} className={style.login}>
            <label>Username <input
                type="text" autoComplete="username" value={username}
                disabled={disabled}
                onChange={e => setUsername(e.target.value)}/></label>
            <label>Password <input
                type="password" autoComplete="password" value={password}
                disabled={disabled}
                onChange={e => setPassword(e.target.value)}/></label>
            <Progress state={state}/>
            <button type="submit" disabled={disabled} className={style.button}>
                Login
            </button>
            <Error state={state} onRetry={() => setState('initial')}/>
        </form>
    </section>
}

const LastLogin = ({baseUri, username, onLogout}) => {
    const [state, setState] = useState('processing')
    const [lastLogin, setLastLogin] = useState('')
    const [retries, setRetries] = useState(0)
    /** @type {{current:HTMLElement}} */
    const ref = useRef()

    useEffect(() => {
        setState('processing');
        (async () => {
            try {
                const params = new URLSearchParams({username})
                const response = await fetch(`${baseUri}/logins?${params}`)
                if (!response.ok) setState('error')
                else {
                    const logins = await response.json()
                    setLastLogin(logins.pop())
                    setState('loaded')
                    ref.current.focus()
                }
            } catch (e) {
                setState('error')
            }
        })()
    }, [baseUri, username, retries])

    const retry = () => setRetries(retries + 1)
    const processing = state === 'processing'
    const error = state === 'error'
    const formatter = new Intl.DateTimeFormat('en', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: 'numeric', minute: 'numeric', second: 'numeric'
    })

    return <section tabIndex="-1" ref={ref} className={style.lastLogin}>
        <h1>Last Login</h1>
        {lastLogin ? <p>{formatter.format(Date.parse(lastLogin))}</p> : null}
        <Progress state={state}/>
        <button type="button" onClick={retry} disabled={processing || error}
                className={style.button}>
            Refresh
        </button>
        <button type="button" onClick={onLogout} disabled={processing || error}
                className={style.button}>
            Logout
        </button>
        <Error state={state} onRetry={retry}/>
    </section>
}

const Progress = ({state}) => {
    if (state !== 'processing') return null

    return <div>
        <div role="progressbar" className={style.progress}>
            <div/>
        </div>
    </div>
}

const Error = ({state, onRetry}) => {
    /** @type {{current:HTMLElement}} */
    const ref = useRef()
    useEffect(() => ref.current?.focus(), [])

    if (state !== 'error') return null

    return <aside className={style.modal}>
        <div tabIndex="-1" ref={ref} className={style.error}>
            <p>An error occurred while processing your login request.</p>
            <button type="button" className={style.button}
                    onClick={() => onRetry()}>
                Retry
            </button>
        </div>
    </aside>
}
