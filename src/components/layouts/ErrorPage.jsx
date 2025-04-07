import { Result } from 'antd';
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Styles } from '../utils/CustomStyle';
import { translate } from '../utils/Translations';
import { useLanguage } from './LanguageContext';

const ErrorPage = () => {
    const { language } = useLanguage();
    const navigate = useNavigate();
    const handleClick = () => {
        navigate('/dashboard');
    };

    return (
        <Result
            status="404"
            title="404"
            subTitle={translate('404')}
            extra={<button onClick={handleClick} className={Styles.btnCreate}>{translate('backHome')}</button>}
        />
    )
}

export default ErrorPage
