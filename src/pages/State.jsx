import React, {useState} from 'react';
import PageWrapper from '../layouts/PageWrapper';
import StateTable from '../features/state/StateTable';
import {useUI} from '../context/UIContext';
import {getStateListService} from '../services/stateServices'

function State() {
    const { showSnackbar, showLoader, hideLoader } = useUI()
    const [stateList, setStateList] = useState([]);
    const getStateListAPICall = (hideSnackbar) => {
      showLoader()
      getStateListService().then(res => {
        if(res){
          setStateList(res)
          !hideSnackbar && showSnackbar('State list fetched successfully!', 'success' )
        }
        else{
          
          !hideSnackbar && showSnackbar('State List is Empty!', 'warning' )
          setStateList([])
        }
        hideLoader()
      }).catch(error => {
        console.log("Error in Fetching State List!", error);
        hideLoader();
        setStateList([])
        !hideSnackbar && showSnackbar('Failed to fetch state list!', 'error' )
      })

    }
   
  
    return (
        <PageWrapper title={"State"} >
            <StateTable  stateList={stateList} getStateListAPICall={getStateListAPICall}/>
        </PageWrapper>
    );
}

export default State;