"use client";

import {
  alpha,
  Box,
  IconButton,
  Paper,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useMemo, useState } from "react";
import Admins from "./components/Admins";
import Projects from "./components/Projects";
import {
  ADMIN_SESSION_EXPIRED_EVENT,
  clearAdminSession,
} from "./services/adminSession";
import Channels from "./components/Channels";
import Banner from "./components/Banner";
import Breakdown from "./components/Breakdown";
import Blog from "./components/Blog";
import SocialMedia from "./components/SocialMedia";
import Comment from "./components/Comment";
import Users from "./components/Users";
import MainPageLayout from "./components/MainPageLayout";
import AboutUs from "./components/AboutUs";
import Donation from "./components/Donation";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const allTabs = [
  {
    id: 0,
    label: "Main Page Layout",
    title: "Main Page Layout",
    permissionKey: "mainPageLayout",
    component: <MainPageLayout />,
  },
  {
    id: 1,
    label: "Banner",
    title: "Banner",
    permissionKey: "banner",
    component: <Banner />,
  },
  {
    id: 2,
    label: "Breakdowns",
    title: "Breakdowns",
    permissionKey: "breakdowns",
    component: <Breakdown />,
  },
  {
    id: 3,
    label: "Blog",
    title: "Blog",
    permissionKey: "blog",
    component: <Blog />,
  },
  {
    id: 4,
    label: "Comments",
    title: "Comments",
    permissionKey: "comments",
    component: <Comment />,
  },
  {
    id: 5,
    label: "Projects",
    title: "Projects",
    permissionKey: "projects",
    component: <Projects />,
  },
  {
    id: 6,
    label: "Channels",
    title: "Channels",
    permissionKey: "channels",
    component: <Channels />,
  },
  {
    id: 7,
    label: "Users (Supporters)",
    title: "Users / Supporters",
    permissionKey: "users",
    component: <Users />,
  },
  {
    id: 8,
    label: "Social Media",
    title: "Social Media",
    permissionKey: "socialMedia",
    component: <SocialMedia />,
  },
  {
    id: 9,
    label: "About Us",
    title: "About Us",
    permissionKey: "aboutUs",
    component: <AboutUs />,
  },
  {
    id: 10,
    label: "Donation",
    title: "Donation",
    permissionKey: "donation",
    component: <Donation />,
  },
  {
    id: 11,
    label: "Admins",
    title: "Admins",
    permissionKey: "admins",
    component: <Admins />,
  },
];

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ px: 3, py: 2, height: "calc(100vh - 180px)" }}>
          {children}
        </Box>
      )}
    </div>
  );
}

type AdminPanelProps = {
  onLogout: () => void;
};

const AdminPanel = ({ onLogout }: AdminPanelProps) => {
  const theme = useTheme();
  const [value, setValue] = useState<number>(0);
  const [adminName, setAdminName] = useState("ادمین");
  const [adminRole, setAdminRole] = useState("");
  const [permissions, setPermissions] = useState<
    Array<{ tab?: string; canRead?: boolean; projectIds?: string[] }>
  >([]);

  useEffect(() => {
    setAdminName(localStorage.getItem("name") || "ادمین");
    setAdminRole(localStorage.getItem("role") || "");

    try {
      setPermissions(JSON.parse(localStorage.getItem("permissions") || "[]"));
    } catch {
      setPermissions([]);
    }
  }, []);

  useEffect(() => {
    const handleSessionExpired = () => {
      onLogout();
    };

    window.addEventListener(ADMIN_SESSION_EXPIRED_EVENT, handleSessionExpired);

    return () => {
      window.removeEventListener(
        ADMIN_SESSION_EXPIRED_EVENT,
        handleSessionExpired
      );
    };
  }, [onLogout]);

  const visibleTabs = useMemo(() => {
    if (adminRole === "super_admin") {
      return allTabs;
    }

    const hasProjectScopedChannelAccess = permissions.some(
      (permission) =>
        permission.tab === "channels" &&
        permission.canRead === true &&
        Array.isArray(permission.projectIds) &&
        permission.projectIds.length > 0
    );

    return allTabs
      .filter(
        (tab) =>
          tab.permissionKey !== "admins" && tab.permissionKey !== "projects"
      )
      .filter(
        (tab) =>
          (tab.permissionKey === "comments" && hasProjectScopedChannelAccess) ||
          permissions.some(
            (permission) =>
              permission.tab === tab.permissionKey &&
              permission.canRead === true
          )
      );
  }, [adminRole, permissions]);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleLogout = () => {
    clearAdminSession();
    onLogout();
  };

  const selectedTabValue = visibleTabs.some((tab) => tab.id === value)
    ? value
    : (visibleTabs[0]?.id ?? 0);

  return (
    <Stack
      sx={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        direction: "ltr",
      }}
    >
      <Stack
        direction="row"
        sx={{
          minHeight: 120,
          maxHeight: 120,
          position: "relative",
          width: "100%",
          px: 5,
          py: 2,
          gap: 2,
          alignItems: "center",
          justifyContent: "space-between",
          overflow: "hidden",
        }}
      >
        <Box
          component="div"
          sx={{
            left: 0,
            pointerEvents: "none",
            position: "absolute",
            right: 0,
            top: 5,
            zIndex: 0,
            height: "100%",
            bottom: 0,
          }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1440 180"
            preserveAspectRatio="xMidYMax slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            <style>
              {`
                .admin-header-wave {
                  animation: adminHeaderWaveKf 5s linear infinite;
                }
                @keyframes adminHeaderWaveKf {
                  0% {
                    d: path("M 0,700 L 0,105 C 55.96507584165741,107.7513133555309 111.93015168331482,110.5026267110618 160,99 C 208.06984831668518,87.4973732889382 248.2444691083981,61.74080651128375 304,65 C 359.7555308916019,68.25919348871625 431.0919718830928,100.53414724380319 491,114 C 550.9080281169072,127.46585275619681 599.3876433592303,122.1226045135035 650,118 C 700.6123566407697,113.8773954864965 753.3574546799853,110.97543470218277 807,98 C 860.6425453200147,85.02456529781723 915.1825379208287,61.97565667776543 968,69 C 1020.8174620791713,76.02434332223457 1071.9123936367,113.12193858675548 1117,132 C 1162.0876063633,150.87806141324452 1201.1678875323714,151.5365889752127 1254,144 C 1306.8321124676286,136.4634110247873 1373.4160562338143,120.73170551239365 1440,105 L 1440,700 L 0,700 Z");
                  }
                  25% {
                    d: path("M 0,700 L 0,105 C 61.2090763349365,110.84585028980146 122.418152669873,116.69170057960291 169,105 C 215.581847330127,93.30829942039709 247.53646565544454,64.07904797138981 297,70 C 346.46353434455546,75.92095202861019 413.43598470834866,116.99210753483784 479,122 C 544.5640152916513,127.00789246516216 608.7195955111606,95.95252188925885 665,99 C 721.2804044888394,102.04747811074115 769.6856332470093,139.19780490812678 814,131 C 858.3143667529907,122.80219509187323 898.5378715008017,69.25625847823406 944,77 C 989.4621284991983,84.74374152176594 1040.162880749784,153.77716117893698 1093,157 C 1145.837119250216,160.22283882106302 1200.8106055000615,97.635096806018 1259,78 C 1317.1893944999385,58.364903193981995 1378.5946972499692,81.682451596991 1440,105 L 1440,700 L 0,700 Z");
                  }
                  50% {
                    d: path("M 0,700 L 0,105 C 59.885855222592184,92.4152176593908 119.77171044518437,79.83043531878161 168,91 C 216.22828955481563,102.16956468121839 252.79901344185475,137.0934763842644 299,153 C 345.20098655814525,168.9065236157356 401.03223578739676,165.79565914416082 458,148 C 514.9677642126032,130.20434085583918 573.0720434085584,97.72388703909236 638,92 C 702.9279565914416,86.27611296090764 774.6795905783698,107.30879269946973 823,103 C 871.3204094216302,98.69120730053027 896.2095942779628,69.04094216302873 942,62 C 987.7904057220372,54.95905783697127 1054.4820323097792,70.52743864841534 1111,72 C 1167.5179676902208,73.47256135158466 1213.8622764829204,60.849303243309905 1267,64 C 1320.1377235170796,67.1506967566901 1380.0688617585397,86.07534837834504 1440,105 L 1440,700 L 0,700 Z");
                  }
                  75% {
                    d: path("M 0,700 L 0,105 C 58.45726970033297,133.3061289924775 116.91453940066594,161.612257984955 167,146 C 217.08546059933406,130.387742015045 258.79911209766925,70.85709705265754 310,56 C 361.20088790233075,41.14290294734246 421.88901220865705,70.95935380441486 480,80 C 538.110987791343,89.04064619558514 593.6448390677025,77.30548772968307 652,83 C 710.3551609322975,88.69451227031693 771.5316315205328,111.81869527685288 819,104 C 866.4683684794672,96.18130472314712 900.2286348501665,57.41973116290542 955,65 C 1009.7713651498335,72.58026883709458 1085.5538290788013,126.5023800715255 1138,137 C 1190.4461709211987,147.4976199284745 1219.5560488346282,114.57074855099272 1266,102 C 1312.4439511653718,89.42925144900728 1376.221975582686,97.21462572450363 1440,105 L 1440,700 L 0,700 Z");
                  }
                  100% {
                    d: path("M 0,700 L 0,105 C 55.96507584165741,107.7513133555309 111.93015168331482,110.5026267110618 160,99 C 208.06984831668518,87.4973732889382 248.2444691083981,61.74080651128375 304,65 C 359.7555308916019,68.25919348871625 431.0919718830928,100.53414724380319 491,114 C 550.9080281169072,127.46585275619681 599.3876433592303,122.1226045135035 650,118 C 700.6123566407697,113.8773954864965 753.3574546799853,110.97543470218277 807,98 C 860.6425453200147,85.02456529781723 915.1825379208287,61.97565667776543 968,69 C 1020.8174620791713,76.02434332223457 1071.9123936367,113.12193858675548 1117,132 C 1162.0876063633,150.87806141324452 1201.1678875323714,151.5365889752127 1254,144 C 1306.8321124676286,136.4634110247873 1373.4160562338143,120.73170551239365 1440,105 L 1440,700 L 0,700 Z");
                  }
                }
              `}
            </style>
            <defs>
              <linearGradient
                id="admin-header-gradient"
                x1="0%"
                y1="50%"
                x2="100%"
                y2="50%"
              >
                <stop offset="100%" stopColor={theme.palette.primary.main} />
                <stop
                  offset="95%"
                  stopColor={alpha(theme.palette.secondary.main, 0.6)}
                />
              </linearGradient>
            </defs>
            <path
              className="admin-header-wave"
              d="M 0,700 L 0,105 C 55.96507584165741,107.7513133555309 111.93015168331482,110.5026267110618 160,99 C 208.06984831668518,87.4973732889382 248.2444691083981,61.74080651128375 304,65 C 359.7555308916019,68.25919348871625 431.0919718830928,100.53414724380319 491,114 C 550.9080281169072,127.46585275619681 599.3876433592303,122.1226045135035 650,118 C 700.6123566407697,113.8773954864965 753.3574546799853,110.97543470218277 807,98 C 860.6425453200147,85.02456529781723 915.1825379208287,61.97565667776543 968,69 C 1020.8174620791713,76.02434332223457 1071.9123936367,113.12193858675548 1117,132 C 1162.0876063633,150.87806141324452 1201.1678875323714,151.5365889752127 1254,144 C 1306.8321124676286,136.4634110247873 1373.4160562338143,120.73170551239365 1440,105 L 1440,700 L 0,700 Z"
              fill="url(#admin-header-gradient)"
              fillOpacity={0.3}
            />
          </svg>
        </Box>

        <Stack sx={{ position: "relative", zIndex: 1 }}>
          <Typography
            component="h1"
            sx={{ fontSize: 25, color: "primary.main" }}
          >
            Admin Panel
          </Typography>
        </Stack>

        <Stack
          direction="row"
          sx={{
            gap: 1,
            alignItems: "center",
            direction: "ltr",
            borderRadius: 3,
            px: 2,
            py: 1,
            bgcolor: (theme) => alpha(theme.palette.primary.light, 0.3),
            position: "relative",
            zIndex: 1,
          }}
        >
          <Typography
            component="h2"
            sx={{ fontSize: 16, fontFamily: "Namecat" }}
          >
            Admin Name:
          </Typography>
          <Typography
            component="h2"
            sx={{
              fontSize: 18,
              fontFamily: "Namecat",
              color: "secondary.main",
            }}
          >
            {adminName}
          </Typography>
          <Tooltip title="Log out">
            <IconButton
              type="button"
              size="small"
              onClick={handleLogout}
              aria-label="Log out"
              sx={{ ml: 0.5, color: "text.secondary" }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      <Stack>
        <Box
          sx={{
            borderBottom: 1,
            borderBottomColor: "primary.light",
            borderBottomStyle: "solid",
            borderBottomWidth: 1,
            overflow: "visible",
          }}
        >
          <Tabs
            value={selectedTabValue}
            onChange={handleChange}
            aria-label="admin tabs"
            sx={{
              overflow: "visible",
              px: 3,
              "& .MuiTabs-scroller": {
                overflow: "visible !important",
              },
              "& .MuiTabs-flexContainer": {
                overflow: "visible",
              },
              "& .MuiTabs-indicator": {
                overflow: "visible",
                "&::after": {
                  borderLeft: "10px solid transparent",
                  borderRight: "10px solid transparent",
                  borderTop: "9px solid",
                  borderTopColor: "primary.main",
                  bottom: -8,
                  content: '""',
                  height: 0,
                  left: "50%",
                  position: "absolute",
                  transform: "translateX(-50%)",
                  width: 0,
                },
              },
            }}
            variant="scrollable"
            scrollButtons="auto"
          >
            {visibleTabs.map((tab) => (
              <Tab
                key={tab.id}
                label={tab.label}
                value={tab.id}
                sx={{
                  fontSize: 16,
                  minHeight: 56,
                  textTransform: "none",
                }}
              />
            ))}
          </Tabs>
        </Box>

        {visibleTabs.map((tab) => (
          <CustomTabPanel key={tab.id} value={selectedTabValue} index={tab.id}>
            {tab.component}
          </CustomTabPanel>
        ))}
        {visibleTabs.length === 0 && (
          <Box sx={{ p: 3 }}>
            <Paper
              elevation={0}
              sx={{
                border: 1,
                borderColor: "divider",
                borderRadius: 3,
                p: 3,
              }}
            >
              <Typography component="h2" sx={{ fontSize: 22, fontWeight: 700 }}>
                No Admin Access
              </Typography>
              <Typography component="p" sx={{ color: "text.secondary", mt: 1 }}>
                Your account does not have permission to view admin tabs.
              </Typography>
            </Paper>
          </Box>
        )}
      </Stack>
    </Stack>
  );
};

export default AdminPanel;
