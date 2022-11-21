import { ListSduParam, ListSduQuery, SduList } from '@/modules/sdu/dtos/list-sdu.dto';
import { FetchService } from '@/modules/fetch/fetch.service';
import { ListSDUHpaEnabledAZsParam } from '@/modules/sdu/dtos/list-sdu-hpa-enabled-azs.dto';
import { ScaleSDUBody, ScaleSDUParam } from '@/modules/sdu/dtos/scale-sdu.dto';
import { GetEnabledSduAutoScalerParam, GetEnabledSduAutoScalerQuery } from '@/modules/sdu/dtos/get-enabled-sdu-auto-scaler.dto';
import { BindSDUsBody, BindSDUsParam } from '@/modules/sdu/dtos/bind-sdus.dto';
import { UnbindSDUParam } from '@/modules/sdu/dtos/unbind-sdu.dto';
import { RestartSDUParam, RestartSDUBody } from '@/modules/sdu/dtos/restart-sdu.dto';
import { SuspendSDUParam, SuspendSDUBody } from '@/modules/sdu/dtos/suspend-sdu.dto';
import { StopSDUParam, StopSDUBody } from '@/modules/sdu/dtos/stop-sdu.dto';
export declare class SduService {
    private readonly fetchService;
    constructor(fetchService: FetchService);
    ping(): Promise<[{
        app?: string | undefined;
        message?: string | undefined;
    }, null] | [null, Error]>;
    private convertMegaByteToGigabyte;
    private convertGigabyteToMegabyte;
    listSdus(param: ListSduParam, query: ListSduQuery): Promise<{
        items: SduList[];
        total: number;
        totalOfInstances: number;
    }>;
    listSDUHpaEnabledAZs(param: ListSDUHpaEnabledAZsParam): Promise<{
        azs: string[];
    }>;
    getEnabledSduAutoScale(_param: GetEnabledSduAutoScalerParam, query: GetEnabledSduAutoScalerQuery): Promise<{
        enabledAutoScale: boolean;
    }>;
    scaleSDU(param: ScaleSDUParam, body: ScaleSDUBody): Promise<void>;
    getUnboundSDUs(): Promise<{
        sdus: string[];
    }>;
    bindSDUs(param: BindSDUsParam, body: BindSDUsBody): Promise<void>;
    unbindSDU(param: UnbindSDUParam): Promise<void>;
    restartSDU(param: RestartSDUParam, body: RestartSDUBody): Promise<void>;
    suspendSDU(param: SuspendSDUParam, body: SuspendSDUBody): Promise<void>;
    stoptSDU(param: StopSDUParam, body: StopSDUBody): Promise<void>;
}
