const validDistance = (distance) => {

    if(distance == "5km" || distance == "10km" || distance == "30km" || distance == "100km"){
        return true;
    }
    return false;
}

module.exports = { validDistance };