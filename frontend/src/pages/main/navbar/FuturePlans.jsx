import {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineIcon,
  Typography,
  TimelineHeader,
} from "@material-tailwind/react";
import {
  BellIcon,
  ArchiveBoxIcon,
  CurrencyDollarIcon,
  BanknotesIcon,
} from "@heroicons/react/24/solid";

export const FuturePlans = () => {
  return (
    <div className="w-[25rem] m-8">
      <div>
        <h2 className="text-5xl font-bold mb-4 flex  flex-col items-center">Our Future Plans</h2>

      </div>
      <Timeline className="p-4s">

        <TimelineItem className="h-28">
          <TimelineConnector className="!w-[78px]" />
          <TimelineHeader className="relative rounded-xl border border-blue-gray-50 bg-white py-3 pl-4 pr-8 shadow-lg shadow-blue-gray-900/5">
            <TimelineIcon className="p-3" variant="ghost" color="green">
              <BanknotesIcon className="h-5 w-5" />
            </TimelineIcon>
            <div className="flex flex-col gap-1">
              <Typography variant="h6" color="blue-gray">
                Pariatur ullamco ipsum sint sunt sint sit nisi ad sit.
              </Typography>
              <Typography variant="small" color="gray" className="font-normal">
                23 DEC 11 PM
              </Typography>
            </div>
          </TimelineHeader>
        </TimelineItem>

        <TimelineItem className="h-28">
          <TimelineConnector className="!w-[78px]" />
          <TimelineHeader className="relative rounded-xl border border-blue-gray-50 bg-white py-3 pl-4 pr-8 shadow-lg shadow-blue-gray-900/5">
            <TimelineIcon className="p-3" variant="ghost" color="red">
              <ArchiveBoxIcon className="h-5 w-5" />
            </TimelineIcon>
            <div className="flex flex-col gap-1">
              <Typography variant="h6" color="blue-gray">
                Pariatur ullamco ipsum sint sunt sint sit nisi ad sit.
              </Typography>
              <Typography variant="small" color="gray" className="font-normal">
                21 DEC 11 PM
              </Typography>
            </div>
          </TimelineHeader>
        </TimelineItem>
        <TimelineItem className="h-28">
          <TimelineHeader className="relative rounded-xl border border-blue-gray-50 bg-white py-3 pl-4 pr-8 shadow-lg shadow-blue-gray-900/5">
            <TimelineIcon className="p-3" variant="ghost" color="green">
              <CurrencyDollarIcon className="h-5 w-5" />
            </TimelineIcon>
            <div className="flex flex-col gap-1">
              <Typography variant="h6" color="blue-gray">
                Aute et enim reprehenderit magna culpa ea exercitation laboris laborum.
              </Typography>
              <Typography variant="small" color="gray" className="font-normal">
                20 DEC 2:20 AM
              </Typography>
            </div>
          </TimelineHeader>
        </TimelineItem>
      </Timeline>
    </div>
  );
}