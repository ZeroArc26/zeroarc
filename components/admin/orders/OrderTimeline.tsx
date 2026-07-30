interface TimelineItem {
  event: string;
  date?: Date | string;
}


interface Props {
  timeline: TimelineItem[];
}


export default function OrderTimeline({
  timeline,
}: Props) {

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">

      <h2 className="text-xl font-bold text-white">
        Order Timeline
      </h2>


      <div className="mt-6 space-y-6">

        {timeline.length === 0 ? (

          <p className="text-sm text-zinc-500">
            No timeline available.
          </p>

        ) : (

          timeline.map((item, index) => (

            <div
              key={index}
              className="flex gap-4"
            >

              {/* Dot */}

              <div className="relative flex flex-col items-center">

                <div className="h-3 w-3 rounded-full bg-violet-500" />

                {index !== timeline.length - 1 && (
                  <div className="mt-2 h-full w-px bg-zinc-800" />
                )}

              </div>


              {/* Content */}

              <div>

                <h3 className="font-medium text-white">
                  {item.event}
                </h3>


                {item.date && (
                  <p className="mt-1 text-xs text-zinc-500">
                    {new Date(
                      item.date
                    ).toLocaleString()}
                  </p>
                )}

              </div>


            </div>

          ))

        )}

      </div>


    </div>
  );
}