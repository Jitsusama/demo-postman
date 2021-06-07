import {useEffect, useRef, useState} from 'react'
import style from './app.module.css'

export const App = () => {
    const [state, setState] = useState('loggedOut');
    const [baseUri, setBaseUri] = useState('http://127.0.0.1:8080')

    return <main className={style.app}>
        <BaseUri value={baseUri} onChange={v => setBaseUri(v)}/>
        {state === 'loggedOut'
            ? <Login baseUri={baseUri} onLogin={() => setState('loggedIn')}/>
            : <LastLogin baseUri={baseUri}/>}
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
                onChange={e => setUsername(e.target.value)}/></label>
            <label>Password <input
                type="password" autoComplete="password" value={password}
                onChange={e => setPassword(e.target.value)}/></label>
            <button type="submit">Login</button>
            <Modal enable={state === 'processing'}>
                <Progress/>
            </Modal>
            <Modal enable={state === 'error'}>
                <Error onRetry={() => setState('initial')}/>
            </Modal>
        </form>
    </section>
}

const LastLogin = ({baseUri, username}) => {
    const [state, setState] = useState('processing')
    const [lastLogin, setLastLogin] = useState('')
    const [retries, setRetries] = useState(0)

    useEffect(() => {
        setState('processing');
        (async () => {
            try {
                const response = await fetch(`${baseUri}/logins?username=${username}`)
                if (!response.ok) setState('error')
                else {
                    setLastLogin((await response.json())[-1])
                    setState('loaded')
                }
            } catch (e) {
                setState('error')
            }
        })()
    }, [baseUri, username, retries])

    const retry = () => setRetries(retries + 1)
    const formatter = new Intl.DateTimeFormat('en', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: 'numeric', minute: 'numeric', second: 'numeric'
    })

    switch (state) {
        case 'processing':
            return <section><Progress/></section>
        case 'error':
            return <section><Error onRetry={retry}/></section>
        default: {
            const date = new Date(lastLogin)
            return <section><p>{formatter.format(date)}</p></section>
        }
    }
}

const Modal = ({enable, children}) => enable
    ? <aside className={style.modal}>{children}</aside>
    : null

const Progress = () => (
    <div>
        <div role="progressbar" className={style.progress}>
            <div/>
        </div>
    </div>
)

const Error = ({onRetry}) => {
    /** @type {{current:HTMLElement}} */
    const ref = useRef();
    useEffect(() => ref.current.focus(), []);

    return <div className={style.error}>
        <p>An error occurred while processing your login request.</p>
        <button ref={ref} type="button" onClick={() => onRetry()}>Retry</button>
    </div>
}
