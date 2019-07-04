import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import SaveAlt from '@material-ui/icons/SaveAlt';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Add from '@material-ui/icons/Add';
import Check from '@material-ui/icons/Check';
import FilterList from '@material-ui/icons/FilterList';
import Remove from '@material-ui/icons/Remove';
import Clear from '@material-ui/icons/Clear';
import Refresh from '@material-ui/icons/Refresh';
import Edit from '@material-ui/icons/Edit';
import SortArrow from '@material-ui/icons/ArrowUpward';
import Delete from '@material-ui/icons/DeleteOutline';

export function getTableIcons() {
  return {
    Add,
    Check,
    Clear,
    Delete,
    DetailPanel: ChevronRight,
    Edit,
    Export: SaveAlt,
    Filter: FilterList,
    FirstPage,
    LastPage,
    NextPage: ChevronRight,
    PreviousPage: ChevronLeft,
    ResetSearch: Clear,
    Search,
    SortArrow,
    ThirdStateCheck: Remove,
    ViewColumn,
    Refresh,
  };
}
