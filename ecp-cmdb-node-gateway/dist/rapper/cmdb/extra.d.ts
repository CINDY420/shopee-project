export declare const IReqType: {
    'POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:cancelcanary': {
        sduName: number;
        deployId: number;
    };
    'POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:editresource': {
        sduName: number;
        deployId: number;
    };
    'POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:fullrelease': {
        sduName: number;
        deployId: number;
    };
    'POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:restart': {
        sduName: number;
        deployId: number;
    };
    'POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:stop': {
        sduName: number;
        deployId: number;
    };
    'POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}:suspend': {
        sduName: number;
        deployId: number;
    };
    'POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}/pods/{podName}:kill': {
        sduName: number;
        deployId: number;
        podName: number;
    };
    'POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}/pods:metrics': {
        deployId: number;
        sduName: number;
    };
};
