import { Card } from "@/components/ui/card";
import { Skeleton, SkeletonAvatar, SkeletonCard, SkeletonText } from "@/components/ui/skeleton";
import { Typography } from "@/components/ui/typography";

export function SkeletonsSection() {
  return (
    <section>
      <Card>
        <Typography variant="h2" className="mb-4">
          Skeletons
        </Typography>

        <div className="space-y-8">
          {/* Basic Variants */}
          <div>
            <Typography variant="h3" className="mb-3">
              Basic Variants
            </Typography>
            <div className="space-y-4">
              <div>
                <Typography variant="small" className="text-gray-500 mb-2">
                  Text Skeleton
                </Typography>
                <SkeletonText width="70%" />
              </div>

              <div>
                <Typography variant="small" className="text-gray-500 mb-2">
                  Circular Skeleton
                </Typography>
                <SkeletonAvatar width={48} height={48} />
              </div>

              <div>
                <Typography variant="small" className="text-gray-500 mb-2">
                  Rectangular Skeleton
                </Typography>
                <SkeletonText width="full" height={120} />
              </div>
            </div>
          </div>

          {/* Complex Components */}
          <div>
            <Typography variant="h3" className="mb-3">
              Complex Components
            </Typography>
            <div className="space-y-6">
              <div>
                <Typography variant="small" className="text-gray-500 mb-2">
                  Card Skeleton
                </Typography>
                <SkeletonCard />
              </div>

              <div>
                <Typography variant="small" className="text-gray-500 mb-2">
                  Avatar with Text
                </Typography>
                <div className="flex items-center space-x-4">
                  <SkeletonAvatar size={48} />
                  <div className="space-y-2 flex-1">
                    <SkeletonText width="30%" />
                    <SkeletonText width="60%" />
                  </div>
                </div>
              </div>

              <div>
                <Typography variant="small" className="text-gray-500 mb-2">
                  List Skeleton
                </Typography>
                <SkeletonText count={3} />
              </div>
            </div>
          </div>

          {/* Custom Configurations */}
          <div>
            <Typography variant="h3" className="mb-3">
              Custom Configurations
            </Typography>
            <div className="space-y-4">
              <div>
                <Typography variant="small" className="text-gray-500 mb-2">
                  Without Animation
                </Typography>
                <Skeleton variant="rectangular" width="full" height={80} animate={false} />
              </div>

              <div>
                <Typography variant="small" className="text-gray-500 mb-2">
                  Custom Dimensions
                </Typography>
                <div className="flex gap-4">
                  <Skeleton variant="circular" width={32} height={32} />
                  <Skeleton variant="circular" width={48} height={48} />
                  <Skeleton variant="circular" width={64} height={64} />
                </div>
              </div>

              <div>
                <Typography variant="small" className="text-gray-500 mb-2">
                  Custom Styling
                </Typography>
                <Skeleton variant="rectangular" width="full" height={100} className="bg-blue-100 dark:bg-blue-900" />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}
