import { useChromeLocalStorage } from '../Lib/storageHandler';
import '../App.css';

function Edit() {
    const [profile, setProfile, _, storeProfile] = useChromeLocalStorage('profile', {});

    const handleSubmit = (e:  React.FormEvent<HTMLFormElement> ) => {
        e.preventDefault();
        storeProfile();
    }

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="givenName">Given Name: </label>
            <input name="givenName" type="text" placeholder="" value={profile?.givenName || ''} onChange={(ev)=>setProfile({...profile, ...{"givenName": ev.target.value}})}/>
            <label htmlFor="familyName">Family Name: </label>
            <input name="familyName" type="text" placeholder="" value={profile?.familyName || ''} onChange={(ev)=>setProfile({...profile, ...{"familyName": ev.target.value}})}/>
            <input type="submit" value="Save"/>
        </form>
    );
}

export default Edit;