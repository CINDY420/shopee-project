import { SduService } from '@/modules/sdu/sdu.service';
import { ListSduParam, ListSduQuery, ListSduResponse } from '@/modules/sdu/dtos/list-sdu.dto';
import { ListSDUHpaEnabledAZsParam, ListSDUHpaEnabledAZsResponse } from '@/modules/sdu/dtos/list-sdu-hpa-enabled-azs.dto';
import { ScaleSDUBody, ScaleSDUParam } from '@/modules/sdu/dtos/scale-sdu.dto';
import { GetEnabledSduAutoScalerBody, GetEnabledSduAutoScalerParam, GetEnabledSduAutoScalerQuery } from '@/modules/sdu/dtos/get-enabled-sdu-auto-scaler.dto';
import { GetUnboundSDUsResponse } from '@/modules/sdu/dtos/get-unbound-sdus.dto';
import { BindSDUsParam, BindSDUsBody } from '@/modules/sdu/dtos/bind-sdus.dto';
import { UnbindSDUParam } from '@/modules/sdu/dtos/unbind-sdu.dto';
import { RestartSDUParam, RestartSDUBody } from '@/modules/sdu/dtos/restart-sdu.dto';
import { SuspendSDUParam, SuspendSDUBody } from '@/modules/sdu/dtos/suspend-sdu.dto';
import { StopSDUParam, StopSDUBody } from '@/modules/sdu/dtos/stop-sdu.dto';
export declare class SduController {
    private sduService;
    constructor(sduService: SduService);
    ping(): Promise<[{
        app?: string | undefined;
        message?: string | undefined;
    }, null] | [null, Error]>;
    listSdus(param: ListSduParam, query: ListSduQuery): Promise<ListSduResponse>;
    listSDUHpaEnabledAZs(param: ListSDUHpaEnabledAZsParam): Promise<ListSDUHpaEnabledAZsResponse>;
    getEnabledSduAutoScale(param: GetEnabledSduAutoScalerParam, query: GetEnabledSduAutoScalerQuery): Promise<GetEnabledSduAutoScalerBody>;
    scaleSDU(param: ScaleSDUParam, body: ScaleSDUBody): Promise<unknown>;
    getUnboundSDUs(): Promise<GetUnboundSDUsResponse>;
    bindSDUs(param: BindSDUsParam, body: BindSDUsBody): Promise<unknown>;
    unbindSDU(param: UnbindSDUParam): Promise<unknown>;
    restartSDU(param: RestartSDUParam, body: RestartSDUBody): Promise<unknown>;
    suspendSDU(param: SuspendSDUParam, body: SuspendSDUBody): Promise<unknown>;
    stopSDU(param: StopSDUParam, body: StopSDUBody): Promise<unknown>;
}
