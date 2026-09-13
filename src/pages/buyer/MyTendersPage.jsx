import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  PlusCircle,
  CalendarDays,
  Users,
  Search,
  SlidersHorizontal,
  CheckCircle2,
  Clock3,
  FolderOpen,
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/Card";
import StatusBadge from "../../components/StatusBadge";
import Button from "../../components/Button";
import { getCurrentUser } from "../../utils/auth";
import { getTenders, getBuyerProfile } from "../../services/api";


function statusColor(status) {
  if (status === "Published") return "green";
  if (status === "Draft") return "amber";
  return "neutral";
}


export default function MyTendersPage() {
  const navigate = useNavigate();

  const [buyer, setBuyer] = useState(null);
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");


  /* ============================================================
     AUTH + DATA
  ============================================================ */

  useEffect(() => {
    const user = getCurrentUser();

    if (!user || user.role !== "buyer") {
      navigate("/login");
      return;
    }

    Promise.all([
      getBuyerProfile(user.profileId),
      getTenders(),
    ])
      .then(([buyerProfile, allTenders]) => {
        setBuyer(buyerProfile);
        setTenders(allTenders);
      })
      .finally(() => setLoading(false));
  }, [navigate]);


  /* ============================================================
     FILTERED TENDERS
  ============================================================ */

  const filteredTenders = useMemo(() => {
    return tenders.filter((tender) => {
      const matchesSearch =
        tender.title
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        tender.tenderId
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesFilter =
        filter === "All" || tender.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [tenders, search, filter]);


  /* ============================================================
     COUNTS
  ============================================================ */

  const publishedCount = tenders.filter(
    (tender) => tender.status === "Published"
  ).length;

  const draftCount = tenders.filter(
    (tender) => tender.status === "Draft"
  ).length;


  /* ============================================================
     LOADING
  ============================================================ */

  if (loading) {
    return (
      <DashboardLayout
        role="buyer"
        userName="Loading..."
      >
        <div className="min-h-[350px] flex items-center justify-center">

          <div className="text-center">

            <div className="
              mx-auto
              w-9
              h-9
              rounded-full
              border-4
              border-blue-100
              border-t-blue-700
              animate-spin
            " />

            <p className="mt-3 text-sm text-slate-500">
              Loading tenders...
            </p>

          </div>

        </div>
      </DashboardLayout>
    );
  }


  return (
    <DashboardLayout
      role="buyer"
      userName={buyer?.organizationName ?? "Buyer"}
    >

      {/* ========================================================
          HEADER
      ======================================================== */}

      <div className="
        flex
        items-start
        justify-between
        gap-5
        mb-5
      ">

        <div>

          <p className="
            text-[11px]
            font-bold
            tracking-widest
            text-blue-700
            uppercase
            mb-1
          ">
            Procurement Workspace
          </p>

          <h1 className="
            text-[27px]
            leading-tight
            font-bold
            tracking-tight
            text-slate-900
          ">
            My Tenders
          </h1>

          <p className="
            mt-1
            text-[13px]
            text-slate-500
          ">
            Manage tenders you've created, published and prepared.
          </p>

        </div>


        <Button
          variant="primary"
          onClick={() =>
            navigate("/buyer/tenders/create")
          }
        >
          <PlusCircle className="w-4 h-4" />
          Create Tender
        </Button>

      </div>


      {/* ========================================================
          SUMMARY
      ======================================================== */}

      <div className="
        grid
        grid-cols-3
        gap-3
        mb-4
      ">

        {/* TOTAL */}

        <div className="
          bg-white
          border
          border-slate-200
          rounded-xl
          px-4
          py-3
          shadow-sm
        ">

          <div className="flex items-center gap-3">

            <div className="
              w-9
              h-9
              rounded-lg
              bg-blue-50
              flex
              items-center
              justify-center
            ">
              <FolderOpen className="w-4 h-4 text-blue-700" />
            </div>

            <div>

              <p className="
                text-[10px]
                font-bold
                uppercase
                tracking-wide
                text-slate-500
              ">
                Total Tenders
              </p>

              <p className="
                mt-0.5
                text-[24px]
                leading-none
                font-bold
                text-slate-900
              ">
                {tenders.length}
              </p>

            </div>

          </div>

        </div>


        {/* PUBLISHED */}

        <div className="
          bg-white
          border
          border-slate-200
          rounded-xl
          px-4
          py-3
          shadow-sm
        ">

          <div className="flex items-center gap-3">

            <div className="
              w-9
              h-9
              rounded-lg
              bg-emerald-50
              flex
              items-center
              justify-center
            ">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            </div>

            <div>

              <p className="
                text-[10px]
                font-bold
                uppercase
                tracking-wide
                text-slate-500
              ">
                Published
              </p>

              <p className="
                mt-0.5
                text-[24px]
                leading-none
                font-bold
                text-slate-900
              ">
                {publishedCount}
              </p>

            </div>

          </div>

        </div>


        {/* DRAFTS */}

        <div className="
          bg-white
          border
          border-slate-200
          rounded-xl
          px-4
          py-3
          shadow-sm
        ">

          <div className="flex items-center gap-3">

            <div className="
              w-9
              h-9
              rounded-lg
              bg-amber-50
              flex
              items-center
              justify-center
            ">
              <Clock3 className="w-4 h-4 text-amber-700" />
            </div>

            <div>

              <p className="
                text-[10px]
                font-bold
                uppercase
                tracking-wide
                text-slate-500
              ">
                Drafts
              </p>

              <p className="
                mt-0.5
                text-[24px]
                leading-none
                font-bold
                text-slate-900
              ">
                {draftCount}
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* ========================================================
          TOOLBAR
      ======================================================== */}

      <div className="
        bg-white
        border
        border-slate-200
        rounded-xl
        shadow-sm
        p-3
        mb-4
        flex
        items-center
        justify-between
        gap-3
      ">

        {/* SEARCH */}

        <div className="
          relative
          flex-1
          max-w-md
        ">

          <Search className="
            absolute
            left-3
            top-1/2
            -translate-y-1/2
            w-4
            h-4
            text-slate-400
          " />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search by tender ID or title..."
            className="
              w-full
              h-10
              pl-9
              pr-3
              rounded-lg
              border
              border-slate-300
              bg-slate-50
              text-[12px]
              text-slate-800
              placeholder:text-slate-400
              focus:outline-none
              focus:border-blue-600
              focus:ring-4
              focus:ring-blue-100
            "
          />

        </div>


        {/* FILTER */}

        <div className="
          flex
          items-center
          gap-2
        ">

          <SlidersHorizontal className="
            w-4
            h-4
            text-slate-400
          " />

          {["All", "Published", "Draft"].map(
            (option) => (

              <button
                key={option}
                type="button"
                onClick={() =>
                  setFilter(option)
                }
                className={`
                  px-3
                  py-2
                  rounded-lg
                  text-[11px]
                  font-bold
                  transition-all

                  ${
                    filter === option
                      ? "bg-blue-700 text-white"
                      : "bg-slate-50 text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-700"
                  }
                `}
              >
                {option}
              </button>

            )
          )}

        </div>

      </div>


      {/* ========================================================
          TENDER LIST
      ======================================================== */}

      {tenders.length === 0 ? (

        <Card className="p-8">

          <div className="text-center">

            <div className="
              mx-auto
              w-12
              h-12
              rounded-xl
              bg-blue-50
              flex
              items-center
              justify-center
            ">
              <FileText className="
                w-6
                h-6
                text-blue-700
              " />
            </div>

            <h2 className="
              mt-4
              text-[16px]
              font-bold
              text-slate-900
            ">
              No tenders created yet
            </h2>

            <p className="
              mt-1
              text-[12px]
              text-slate-500
            ">
              Create your first tender to begin procurement.
            </p>

            <Button
              variant="primary"
              className="mt-4"
              onClick={() =>
                navigate("/buyer/tenders/create")
              }
            >
              <PlusCircle className="w-4 h-4" />
              Create Tender
            </Button>

          </div>

        </Card>

      ) : filteredTenders.length === 0 ? (

        <Card className="p-8">
  <div className="text-center">
    <Search className="w-7 h-7 text-slate-300 mx-auto" />

    <h2 className="mt-3 text-[15px] font-bold text-slate-800">
      No matching tenders
    </h2>

    <p className="mt-1 text-[12px] text-slate-500">
      Try changing your search or filter.
    </p>
  </div>
</Card>

      ) : (

        <div className="space-y-3">

          {filteredTenders.map((tender) => (

            <div
              key={tender.id}
              className="
                bg-white
                border
                border-slate-200
                rounded-xl
                shadow-sm
                px-5
                py-4
                hover:shadow-md
                hover:border-blue-200
                transition-all
              "
            >

              <div className="
                flex
                items-center
                justify-between
                gap-5
              ">


                {/* LEFT */}

                <div className="
                  flex
                  items-center
                  gap-3
                  min-w-0
                ">

                  <div className="
                    w-11
                    h-11
                    rounded-xl
                    bg-blue-50
                    flex
                    items-center
                    justify-center
                    shrink-0
                  ">

                    <FileText className="
                      w-5
                      h-5
                      text-blue-700
                    " />

                  </div>


                  <div className="min-w-0">

                    <div className="
                      flex
                      items-center
                      gap-2
                    ">

                      <p className="
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-wide
                        text-slate-400
                      ">
                        {tender.tenderId}
                      </p>

                      <StatusBadge
                        status={statusColor(
                          tender.status
                        )}
                      >
                        {tender.status}
                      </StatusBadge>

                    </div>


                    <h3 className="
                      mt-1
                      text-[14px]
                      font-bold
                      text-slate-900
                      truncate
                    ">
                      {tender.title}
                    </h3>


                    <div className="
                      mt-1.5
                      flex
                      items-center
                      gap-4
                    ">

                      <span className="
                        inline-flex
                        items-center
                        gap-1
                        text-[11px]
                        text-slate-500
                      ">
                        <CalendarDays className="w-3.5 h-3.5" />
                        Deadline: {tender.deadline}
                      </span>

                      <span className="
                        inline-flex
                        items-center
                        gap-1
                        text-[11px]
                        text-slate-500
                      ">
                        <Users className="w-3.5 h-3.5" />
                        Procurement Tender
                      </span>

                    </div>

                  </div>

                </div>


                {/* RIGHT */}

                <div className="
                  shrink-0
                  flex
                  items-center
                  gap-2
                ">

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/buyer/tenders/${tender.id}`
                      )
                    }
                    className="
                      px-3
                      py-2
                      rounded-lg
                      border
                      border-slate-300
                      bg-white
                      text-[11px]
                      font-bold
                      text-slate-700
                      hover:border-blue-500
                      hover:text-blue-700
                      hover:bg-blue-50
                      transition-all
                    "
                  >
                    View Tender
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </DashboardLayout>
  );
}