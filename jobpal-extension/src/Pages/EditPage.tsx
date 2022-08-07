import { getPrefillData, storePrefillData } from '../Lib/storageHandler';
import '../App.css';
import { useEffect, useState } from 'react';
import {SpecificPrefillData, PrefillData, CommonPrefillData} from '../Lib/StorageType';

function Edit() {
    const handleSubmit = (e:  React.FormEvent<HTMLFormElement> ) => {
        e.preventDefault();
    }

    return (
        <form onSubmit={handleSubmit}>

        </form>
    );
}

export default Edit;