import { ItemEmpty } from '.';
export declare class Item99552 {
    'notifyFailed': boolean;
    'selected': boolean;
    'stabilizationWindowSeconds': number;
}
export declare class Item99551 {
    'metrics': string;
    'threshold': number;
}
export declare class Item99549 {
    'endTime': string;
    'endWeekday': ItemEmpty;
    'repeatType': ItemEmpty;
    'startTime': string;
    'startWeekday': ItemEmpty;
    'targetCount': number;
}
export declare class Item99543 {
    'autoscalingRule': Item99551;
    'cronRule': Item99549;
    'type': string;
}
export declare class Item99541 {
    'scaleDown': Item99552;
    'scaleUp': Item99552;
}
export declare class Item99537 {
    'autoscalingLogic': string;
    'behavior': Item99541;
    'maxReplicaCount': number;
    'minReplicaCount': number;
    'notifyChannel': string;
    'status': number;
    'triggerRules': Item99543[];
    'updatedTime': string;
    'updator': string;
}
export declare class Item99535 {
    'az': string;
    'sdu': string;
}
export declare class Item99533 {
    'id': number;
    'meta': Item99535;
    'spec': Item99537;
}
export declare class GetEcpapiV2Sdus1SduNameHpasReqDto {
    'sduName': string;
}
export declare class GetEcpapiV2Sdus1SduNameHpasResDto {
    'items': Item99533[];
    'total': number;
}
