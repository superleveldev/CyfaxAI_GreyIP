import CompanyDomainNameVariationTable from "@/components/company-domain-name-variation-table";
import CompanyExploitableServicesTable from "@/components/company-exploitable-services-table";
import EmailProtectionResultsTable from "@/components/email-protection-results-table";
import IconCircleExclamation from "@/components/icons/icon-circle-exclamation";
import SubDomainExploitableServicesTable from "@/components/sub-domain-exploitable-services-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import Link from "next/link";
import useDetailReport from "@/views/current-risk/hooks/useDetailReport";
import { ComponentProps, forwardRef, useMemo } from "react";
import { FormattedMessage } from "react-intl";
import {useState} from "react";
import routes from "@/constants/routes";

const AttackSurface = () => {
  const { data } = useDetailReport();
  const [selectedTab, setSelectedTab] = useState<keyof typeof routes>("company_exploitable_services"); 
  
  const tabs = useMemo(() => {
    return [
      {
        value: "company_exploitable_services",
        trigger: (
          <TriggerBox
            title="companyExploitableServices"
            onClick={()=>setSelectedTab("company_exploitable_services")}
            value={data?.vulnscan_result.org_domain.count}
          />
        ),
        content: (
          <CompanyExploitableServicesTable
            rows={data?.vulnscan_result.org_domain.ports || []}
          />
        ),
        title: "companyExploitableServices",
        seeAllLink: "#",
      },
      {
        value: "sub_domain_exploitable_services",
        trigger: (
          <TriggerBox
            title="subDomainExploitableServices"
            onClick={()=>setSelectedTab("sub_domain_exploitable_services")}
            value={
              (data?.vulnscan_result.count || 0) -
              (data?.vulnscan_result.org_domain.count || 0)
            }
          />
        ),
        content: (
          <>
            {data?.vulnscan_result.sub_domain && (
              <SubDomainExploitableServicesTable
                subdomains={data?.vulnscan_result.sub_domain}
              />
            )}
          </>
        ),
        title: "subDomainExploitableServices",
        seeAllLink: "#",
      },
      {
        value: "domain_name_variations",
        trigger: (
          <TriggerBox
            title="domainNameVariations"
            onClick={()=>setSelectedTab("domain_name_variations")}
            value={data?.dnstwist_result.count}
          />
        ),
        content: (
          <>
            {data?.dnstwist_result.dnstwist_items && (
              <CompanyDomainNameVariationTable
                rows={data?.dnstwist_result.dnstwist_items}
              />
            )}
          </>
        ),
        title: "domainNameVariations",
        seeAllLink: "#",
      },
      {
        value: "email_weaknesses",
        trigger: (
          <TriggerBox
            title={"emailWeaknesses"}
            onClick={()=>setSelectedTab("email_weaknesses")}
            value={data?.mxtoolbox_result.count}
          />
        ),
        content: (
          <>
            {data?.mxtoolbox_result.mxtoolbox_category && (
              <EmailProtectionResultsTable
                data={data?.mxtoolbox_result.mxtoolbox_category}
              />
            )}
          </>
        ),
        title: "emailWeaknesses",
        seeAllLink: "#",
      },
    ];
  }, [
    data?.dnstwist_result.count,
    data?.dnstwist_result.dnstwist_items,
    data?.mxtoolbox_result.count,
    data?.mxtoolbox_result.mxtoolbox_category,
    data?.vulnscan_result.count,
    data?.vulnscan_result.org_domain.count,
    data?.vulnscan_result.org_domain.ports,
    data?.vulnscan_result.sub_domain,
    setSelectedTab
  ]);

  return (
    <>
      <div className="mt-6 rounded-lg p-3 shadow-[0_0_12px_rgba(0,0,0,0.12)] sm:rounded-xl sm:p-5">
        <div className="flex items-center gap-x-3">
          <h2 className="text-lg font-medium max-sm:tracking-[0.3px] sm:text-2xl/[150%] sm:font-semibold">
            <FormattedMessage id="attackSurface" />
          </h2>
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger>
                <IconCircleExclamation className="w-5 text-[#292D32] sm:w-6" />
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  <FormattedMessage id="attactSrufaceModalText" />
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <Tabs defaultValue={tabs[0].value}>
          <TabsList asChild>
            <div className="mt-5 grid grid-cols-2 items-center gap-3 sm:w-fit sm:grid-cols-4 md:gap-5 lg:my-5">
              {tabs.map((tab) => (
                <TabsTrigger asChild value={tab.value} key={tab.value}>
                  {tab.trigger}
                </TabsTrigger>
              ))}
            </div>
          </TabsList>

          {tabs.map((tab) => (
            <TabsContent value={tab.value} key={tab.value} asChild>
              <div>
                <div className="mt-5 flex items-center justify-between">
                  <h3 className="text-sm font-semibold lg:text-xl lg:font-medium">
                    <FormattedMessage id={tab.title} />
                  </h3>
                  <Link href={ typeof routes[selectedTab] === "function" ? 
                    routes[selectedTab]("company-exploitable-services") : routes[selectedTab]
                  } passHref>
                    <button className="text-sm font-medium text-accent duration-300 hover:opacity-90 lg:text-xl lg:font-medium">
                      <FormattedMessage id="seeAll" />
                    </button>
                  </Link>
                  
                </div>

                <div className="mt-3 lg:mt-5">
                  <div className="overflow-hidden rounded shadow-[0_4px_14px_2px_rgba(0,0,0,0.06)]">
                    {tab.content}
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </>
  );
};

export default AttackSurface;

type TriggrrBoxProps = {
  title: any;
  value: string | number | undefined;
} & ComponentProps<"button">;
const TriggerBox = forwardRef<HTMLButtonElement, TriggrrBoxProps>(
  ({ title, value, ...props }, ref) => {
    return (
      <button
        {...props}
        ref={ref}
        className={cn(
          "rounded-lg border border-black/50 group p-2.5 hover:bg-accent/5 sm:rounded-xl sm:px-2.5 sm:py-4 flex flex-col justify-between items-center min-h-[100px] lg:min-h-[115px] gap-5",
          "data-[state=active]:bg-accent/10",
          props.className,
        )}
      >
        <p className="mx-auto max-w-[115px] text-center text-xs/[150%] font-medium tracking-[-0.3px] group-last:max-w-[105px]">
          <FormattedMessage id={title} />
        </p>
        <p className="text-center font-medium text-accent">{value}</p>
      </button>
    );
  },
);
TriggerBox.displayName = "TriggerBox";
