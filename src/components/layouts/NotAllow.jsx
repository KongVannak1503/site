import { Result } from 'antd'
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Styles } from '../utils/CustomStyle';
import { useLanguage } from './LanguageContext';
import { translate } from '../utils/Translations';

const NotAllow = () => {
    const { language } = useLanguage();
    const navigate = useNavigate();
    const handleClick = () => {
        navigate('/dashboard');
    };
    return (
        <Result
            status="403"
            title="403"
            subTitle={translate('403')}
            extra={<button onClick={handleClick} className={Styles.btnCreate}>{translate('backHome')}</button>}

        />
    )
}

export default NotAllow
